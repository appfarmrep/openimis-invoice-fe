import React, { useState, useRef, useEffect } from "react";
import {
  Form,
  Helmet,
  withHistory,
  formatMessage,
  formatMessageWithValues,
  coreConfirm,
  journalize,
} from "@openimis/fe-core";
import { injectIntl } from "react-intl";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { withTheme, withStyles } from "@material-ui/core/styles";
import { RIGHT_INVOICE_UPDATE, STATUS } from "../constants";
import { fetchInvoice, deleteInvoice, updateInvoice } from "../actions";
import InvoiceHeadPanel from "../components/InvoiceHeadPanel";
import DeleteIcon from "@material-ui/icons/Delete";
import SaveIcon from "@material-ui/icons/Save";
import { getEnumValue } from "../util/enum";
import InvoiceTabPanel from "../components/InvoiceTabPanel";
import { ACTION_TYPE } from "../reducer";
import { defaultPageStyles } from "../util/styles";
import { toast } from 'react-hot-toast';
import { Icon } from '@iconify/react';
import { useStore } from "../store";

const InvoicePage = ({
  intl,
  classes,
  rights,
  history,
  invoiceUuid,
  invoice,
  fetchInvoice,
  deleteInvoice,
  updateInvoice,
  coreConfirm,
  confirmed,
  submittingMutation,
  mutation,
  journalize,
}) => {
  const [editedInvoice, setEditedInvoice] = useState({});
  const [confirmedAction, setConfirmedAction] = useState(() => null);
  const prevSubmittingMutationRef = useRef();

  useEffect(() => {
    if (!!invoiceUuid) {
      fetchInvoice([`id: "${invoiceUuid}"`]);
    }
  }, [invoiceUuid]);

  useEffect(() => confirmed && confirmedAction(), [confirmed]);

  useEffect(() => {
    if (prevSubmittingMutationRef.current && !submittingMutation) {
      journalize(mutation);
      mutation?.actionType === ACTION_TYPE.DELETE_INVOICE && back();
    }
  }, [submittingMutation]);

  useEffect(() => {
    prevSubmittingMutationRef.current = submittingMutation;
  });

  useEffect(() => setEditedInvoice(invoice), [invoice]);

  const back = () => history.goBack();

  const [forceRender, setForceRender] = useState(0); // new state

  const onChange = (invoice) => setEditedInvoice(invoice);

  const titleParams = (invoice) => ({ label: invoice?.code });

  const deleteInvoiceCallback = () =>
    deleteInvoice(
      invoice,
      formatMessageWithValues(intl, "invoice", "invoice.delete.mutationLabel", {
        code: invoice?.code,
      }),
    );

  const openDeleteInvoiceConfirmDialog = () => {
    setConfirmedAction(() => deleteInvoiceCallback);
    coreConfirm(
      formatMessageWithValues(intl, "invoice", "invoice.delete.confirm.title", {
        code: invoice?.code,
      }),
      formatMessage(intl, "invoice", "invoice.delete.confirm.message"),
    );
  };

  const { invoiceStatus, invoiceNote, invoicePaymentReference } = useStore();

  const saveInvoiceCallback = (invoice) => {
    const status = invoiceStatus || invoice.status;
    const note = invoiceNote || invoice.note;
    const paymentReference = invoicePaymentReference || invoice.paymentReference;
    updateInvoice(
      { id: invoiceUuid, status, note, paymentReference },
      formatMessageWithValues(intl, "invoice", "invoice.update.mutationLabel", {
        code: invoice?.code,
      }),
    );
  };

  const openSaveInvoiceConfirmDialog = () => {
    setConfirmedAction(() => saveInvoiceCallback);
    coreConfirm(
      formatMessageWithValues(intl, "invoice", "invoice.save.confirm.title", {
        code: invoice?.code,
      }),
      formatMessage(intl, "invoice", "invoice.save.confirm.message"),
    );
  };

  const abstainInvoiceCallback = () => {
    const status = "7";
    const note = invoiceNote || invoice.note;
    const paymentReference = invoicePaymentReference || invoice.paymentReference;
    updateInvoice(
      { id: invoiceUuid, status, note, paymentReference },
      formatMessageWithValues(intl, "invoice", "invoice.update.mutationLabel", {
        code: invoice?.code,
      }),
    );
    fetchInvoice([`id: "${invoiceUuid}"`]); // Refetch the invoice
    setForceRender(prev => prev + 1);
  };

  const openAbstainInvoiceConfirmDialog = () => {
    setConfirmedAction(() => abstainInvoiceCallback);
    coreConfirm(
      formatMessageWithValues(intl, "invoice", "invoice.abstain.confirm.title", {
        code: invoice?.code,
      }),
      formatMessage(intl, "invoice", "invoice.abstain.confirm.message"),
    );
  };

  const approveInvoiceCallback = () => {
    const status = "2";
    const note = invoiceNote || invoice.note;
    const paymentReference = invoicePaymentReference || invoice.paymentReference;
    updateInvoice(
      { id: invoiceUuid, status, note, paymentReference },
      formatMessageWithValues(intl, "invoice", "invoice.update.mutationLabel", {
        code: invoice?.code,
      }),
    );
  };

  const openApproveInvoiceConfirmDialog = () => {
    setConfirmedAction(() => approveInvoiceCallback);
    coreConfirm(
      formatMessageWithValues(intl, "invoice", "invoice.approve.confirm.title", {
        code: invoice?.code,
      }),
      formatMessage(intl, "invoice", "invoice.approve.confirm.message"),
    );
  };

  console.log(invoice)

  const actions = [
    !!invoice &&
      getEnumValue(invoice?.status) !== STATUS.PAID && {
        doIt: openDeleteInvoiceConfirmDialog,
        icon: <DeleteIcon />,
        tooltip: formatMessage(intl, "invoice", "deleteButtonTooltip"),
      },
      {
        doIt: openSaveInvoiceConfirmDialog,
        icon: <SaveIcon />,
        tooltip: formatMessage(intl, "invoice", "saveButtonTooltip"),
      },
      {
        doIt: openApproveInvoiceConfirmDialog,
        icon: <Icon icon="ph:check-fill" />,
        tooltip: formatMessage(intl, "invoice", "approveButtonTooltip"),
      },
      
  ];

  return (
    rights.includes(RIGHT_INVOICE_UPDATE) && (
      <div className={classes.page}>
        <Helmet title={formatMessageWithValues(intl, "invoice", "pageTitle", titleParams(invoice))} />
        <Form
          module="invoice"
          title="pageTitle"
          titleParams={titleParams(invoice)}
          invoice={editedInvoice}
          back={back}
          onChange={onChange}
          HeadPanel={InvoiceHeadPanel}
          Panels={[InvoiceTabPanel]}
          rights={rights}
          actions={actions}
          setConfirmedAction={setConfirmedAction}
        />
      </div>
    )
  );
};

const mapStateToProps = (state, props) => ({
  rights: !!state.core && !!state.core.user && !!state.core.user.i_user ? state.core.user.i_user.rights : [],
  invoiceUuid: props.match.params.invoice_uuid,
  confirmed: state.core.confirmed,
  fetchingInvoice: state.invoice.fetchingInvoice,
  fetchedInvoice: state.invoice.fetchedInvoice,
  invoice: state.invoice.invoice,
  errorInvoice: state.invoice.errorInvoice,
  policyHolders: state.policyHolder.policyHolders,
  submittingMutation: state.invoice.submittingMutation,
  mutation: state.invoice.mutation,
});

const mapDispatchToProps = (dispatch) =>
  bindActionCreators({ fetchInvoice, deleteInvoice, updateInvoice, coreConfirm, journalize }, dispatch);

export default withHistory(
  injectIntl(withTheme(withStyles(defaultPageStyles)(connect(mapStateToProps, mapDispatchToProps)(InvoicePage)))),
);
