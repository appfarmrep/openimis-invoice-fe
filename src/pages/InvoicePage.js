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

  const saveInvoice = (invoice) => {
    console.log(invoiceUuid)
    const status = localStorage.getItem('invoiceStatus') || invoice.status;
    const note = localStorage.getItem('invoiceNote') || invoice.note;
    const paymentReference = localStorage.getItem('invoicePaymentReference') || invoice.paymentReference;
    updateInvoice(
      { id: invoiceUuid, status, note, paymentReference },
      formatMessageWithValues(intl, "invoice", "invoice.update.mutationLabel", {
        code: invoice?.code,
      }),
    );
    toast.success("Invoice saved successfully!");
  };
  const abstainInvoice = () => {
    console.log(invoice)
    const status = "7";
    const note = localStorage.getItem('invoiceNote') || invoice.note;
    const paymentReference = localStorage.getItem('invoicePaymentReference') || invoice.paymentReference;
    updateInvoice(
      { id: invoiceUuid, status, note, paymentReference },
      formatMessageWithValues(intl, "invoice", "invoice.update.mutationLabel", {
        code: invoice?.code,
      }),
    );
    toast.success("Invoice abstained successfully!");
    fetchInvoice([`id: "${invoiceUuid}"`]); // Refetch the invoice
    setForceRender(prev => prev + 1);
  };
  
  const approveInvoice = () => {
    const status = STATUS.PAID;
    const note = localStorage.getItem('invoiceNote') || invoice.note;
    const paymentReference = localStorage.getItem('invoicePaymentReference') || invoice.paymentReference;
    updateInvoice(
      { id: invoiceUuid, status, note, paymentReference },
      formatMessageWithValues(intl, "invoice", "invoice.update.mutationLabel", {
        code: invoice?.code,
      }),
    );
    toast.success("Invoice approved successfully!");
    fetchInvoice([`id: "${invoiceUuid}"`]); // Refetch the invoice
    setForceRender(prev => prev + 1);
  };

  const actions = [
    !!invoice &&
      getEnumValue(invoice?.status) !== STATUS.PAID && {
        doIt: openDeleteInvoiceConfirmDialog,
        icon: <DeleteIcon />,
        tooltip: formatMessage(intl, "invoice", "deleteButtonTooltip"),
      },
      {
        doIt: saveInvoice,
        icon: <SaveIcon />,
        tooltip: formatMessage(intl, "invoice", "saveButtonTooltip"),
      },
      !!invoice &&
      getEnumValue(invoice?.status) !== "2" && {
        doIt: approveInvoice,
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
