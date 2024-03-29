import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { Grid, Divider, Typography, Button } from "@material-ui/core";
import { withModulesManager, TextInput, FormattedMessage, PublishedComponent, NumberInput } from "@openimis/fe-core";
import { injectIntl } from "react-intl";
import { withTheme, withStyles } from "@material-ui/core/styles";
import SubjectTypePicker from "../pickers/SubjectTypePicker";
import ThirdpartyTypePicker from "../pickers/ThirdpartyTypePicker";
import { getSubjectAndThirdpartyTypePicker } from "../util/subject-and-thirdparty-picker";
import InvoiceStatusPicker from "../pickers/InvoiceStatusPicker";
import { defaultHeadPanelStyles } from "../util/styles";

const InvoiceHeadPanel = ({ modulesManager, classes, invoice, mandatoryFieldsEmpty }) => {
  const { register, handleSubmit, setValue, watch } = useForm();

  const [status, setStatus] = useState(invoice?.status);
  const [note, setNote] = useState(invoice?.note);

  const onSubmit = data => console.log(data);

  const taxAnalysisTotal = !!invoice?.taxAnalysis ? JSON.parse(invoice.taxAnalysis)?.["total"] : null;
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Grid container className={classes.tableTitle}>
        <Grid item>
          <Grid container align="center" justify="center" direction="column" className={classes.fullHeight}>
            <Grid item>
              <Typography>
                <FormattedMessage module="invoice" id="headPanelTitle" />
              </Typography>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
      <Divider />
      {mandatoryFieldsEmpty && (
        <>
          <div className={classes.item}>
            <FormattedMessage module="invoice" id="mandatoryFieldsEmptyError" />
          </div>
          <Divider />
        </>
      )}
      <Grid container className={classes.item}>
        <Grid item xs={3} className={classes.item}>
          <SubjectTypePicker label="invoice.subject" withNull value={invoice?.subjectTypeName} readOnly />
        </Grid>
        <Grid item xs={3} className={classes.item}>
          {getSubjectAndThirdpartyTypePicker(modulesManager, invoice?.subjectTypeName, invoice?.subject)}
        </Grid>
        <Grid item xs={3} className={classes.item}>
          <ThirdpartyTypePicker label="invoice.thirdparty" withNull value={invoice?.thirdpartyTypeName} readOnly />
        </Grid>
        <Grid item xs={3} className={classes.item}>
          {getSubjectAndThirdpartyTypePicker(modulesManager, invoice?.thirdpartyTypeName, invoice?.thirdparty)}
        </Grid>
        <Grid item xs={3} className={classes.item}>
          <TextInput module="invoice" label="invoice.code" value={invoice?.code} readOnly />
        </Grid>
        <Grid item xs={3} className={classes.item}>
          <TextInput module="invoice" label="invoice.codeTp" value={invoice?.codeTp} readOnly />
        </Grid>
        <Grid item xs={3} className={classes.item}>
          <TextInput module="invoice" label="invoice.codeExt" value={invoice?.codeExt} readOnly />
        </Grid>
        <Grid item xs={3} className={classes.item}>
          <PublishedComponent
            pubRef="core.DatePicker"
            module="invoice"
            label="invoice.dateDue"
            value={invoice?.dateDue}
            readOnly
          />
        </Grid>
        <Grid item xs={3} className={classes.item}>
          <PublishedComponent
            pubRef="core.DatePicker"
            module="invoice"
            label="invoice.dateInvoice"
            value={invoice?.dateInvoice}
            readOnly
          />
        </Grid>
        <Grid item xs={3} className={classes.item}>
          <PublishedComponent
            pubRef="core.DatePicker"
            module="invoice"
            label="invoice.dateValidFrom"
            value={invoice?.dateValidFrom}
            readOnly
          />
        </Grid>
        <Grid item xs={3} className={classes.item}>
          <PublishedComponent
            pubRef="core.DatePicker"
            module="invoice"
            label="invoice.dateValidTo"
            value={invoice?.dateValidTo}
            readOnly
          />
        </Grid>
        <Grid item xs={3} className={classes.item}>
          <PublishedComponent
            pubRef="core.DatePicker"
            module="invoice"
            label="invoice.datePayed"
            value={invoice?.datePayed}
            readOnly
          />
        </Grid>
        <Grid item xs={3} className={classes.item}>
          <NumberInput
            module="invoice"
            label="invoice.amountDiscount"
            displayZero
            value={invoice?.amountDiscount}
            readOnly
          />
        </Grid>
        <Grid item xs={3} className={classes.item}>
          <NumberInput module="invoice" label="invoice.amountNet" displayZero value={invoice?.amountNet} readOnly />
        </Grid>
        <Grid item xs={3} className={classes.item}>
          <TextInput module="invoice" label="invoice.taxAnalysis" value={taxAnalysisTotal} readOnly />
        </Grid>
        <Grid item xs={3} className={classes.item}>
          <NumberInput module="invoice" label="invoice.amountTotal" displayZero value={invoice?.amountTotal} readOnly />
        </Grid>
        <Grid item xs={3} className={classes.item}>
          <InvoiceStatusPicker label="invoice.status.label" withNull value={status} onChange={setStatus} />
        </Grid>
        <Grid item xs={3} className={classes.item}>
          <TextInput module="invoice" label="invoice.note" value={note} onChange={setNote} />
        </Grid>
        <Grid item xs={3} className={classes.item}>
          <TextInput module="invoice" label="invoice.terms" value={invoice?.terms} readOnly />
        </Grid>
        <Grid item xs={3} className={classes.item}>
          <TextInput module="invoice" label="invoice.paymentReference" value={invoice?.paymentReference} readOnly />
        </Grid>
      </Grid>
      <Grid container justify="flex-end" style={{ padding: '10px', margin: '10px' }}>
        <Button type="submit" variant="contained" color="primary">
          Submit
        </Button>
      </Grid>
    </form>
  );
};

export default withModulesManager(injectIntl(withTheme(withStyles(defaultHeadPanelStyles)(InvoiceHeadPanel))));
