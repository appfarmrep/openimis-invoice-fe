import React from "react";
import { useForm, Controller } from "react-hook-form";
import { Grid, Divider, Typography } from "@material-ui/core";
import { withModulesManager, TextInput, FormattedMessage, PublishedComponent, NumberInput } from "@openimis/fe-core";
import { injectIntl } from "react-intl";
import { withTheme, withStyles } from "@material-ui/core/styles";
import SubjectTypePicker from "../pickers/SubjectTypePicker";
import ThirdpartyTypePicker from "../pickers/ThirdpartyTypePicker";
import { getSubjectAndThirdpartyTypePicker } from "../util/subject-and-thirdparty-picker";
import InvoiceStatusPicker from "../pickers/InvoiceStatusPicker";
import { defaultHeadPanelStyles } from "../util/styles";

const InvoiceHeadPanel = ({ modulesManager, classes, invoice, mandatoryFieldsEmpty }) => {
  const { control } = useForm({
    defaultValues: {
      ...invoice,
      taxAnalysisTotal: !!invoice?.taxAnalysis ? JSON.parse(invoice.taxAnalysis)?.["total"] : null,
    }
  });

  return (
    <>
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
          <Controller
            name="subjectTypeName"
            control={control}
            render={({ field }) => (
              <SubjectTypePicker label="invoice.subject" withNull {...field} readOnly />
            )}
          />
        </Grid>
        <Grid item xs={3} className={classes.item}>
          {getSubjectAndThirdpartyTypePicker(modulesManager, invoice?.subjectTypeName, invoice?.subject)}
        </Grid>
        <Grid item xs={3} className={classes.item}>
          <Controller
            name="thirdpartyTypeName"
            control={control}
            render={({ field }) => (
              <ThirdpartyTypePicker label="invoice.thirdparty" withNull {...field} readOnly />
            )}
          />
        </Grid>
        <Grid item xs={3} className={classes.item}>
          {getSubjectAndThirdpartyTypePicker(modulesManager, invoice?.thirdpartyTypeName, invoice?.thirdparty)}
        </Grid>
        <Grid item xs={3} className={classes.item}>
          <Controller
            name="code"
            control={control}
            render={({ field }) => (
              <TextInput module="invoice" label="invoice.code" {...field} readOnly />
            )}
          />
        </Grid>
        <Grid item xs={3} className={classes.item}>
          <Controller
            name="codeTp"
            control={control}
            render={({ field }) => (
              <TextInput module="invoice" label="invoice.codeTp" {...field} readOnly />
            )}
          />
        </Grid>
        <Grid item xs={3} className={classes.item}>
          <Controller
            name="codeExt"
            control={control}
            render={({ field }) => (
              <TextInput module="invoice" label="invoice.codeExt" {...field} readOnly />
            )}
          />
        </Grid>
        <Grid item xs={3} className={classes.item}>
          <Controller
            name="dateDue"
            control={control}
            render={({ field }) => (
              <PublishedComponent
                pubRef="core.DatePicker"
                module="invoice"
                label="invoice.dateDue"
                {...field}
                readOnly
              />
            )}
          />
        </Grid>
        <Grid item xs={3} className={classes.item}>
          <Controller
            name="dateInvoice"
            control={control}
            render={({ field }) => (
              <PublishedComponent
                pubRef="core.DatePicker"
                module="invoice"
                label="invoice.dateInvoice"
                {...field}
                readOnly
              />
            )}
          />
        </Grid>
        <Grid item xs={3} className={classes.item}>
          <Controller
            name="dateValidFrom"
            control={control}
            render={({ field }) => (
              <PublishedComponent
                pubRef="core.DatePicker"
                module="invoice"
                label="invoice.dateValidFrom"
                {...field}
                readOnly
              />
            )}
          />
        </Grid>
        <Grid item xs={3} className={classes.item}>
          <Controller
            name="dateValidTo"
            control={control}
            render={({ field }) => (
              <PublishedComponent
                pubRef="core.DatePicker"
                module="invoice"
                label="invoice.dateValidTo"
                {...field}
                readOnly
              />
            )}
          />
        </Grid>
        <Grid item xs={3} className={classes.item}>
          <Controller
            name="datePayed"
            control={control}
            render={({ field }) => (
              <PublishedComponent
                pubRef="core.DatePicker"
                module="invoice"
                label="invoice.datePayed"
                {...field}
                readOnly
              />
            )}
          />
        </Grid>
        <Grid item xs={3} className={classes.item}>
          <Controller
            name="amountDiscount"
            control={control}
            render={({ field }) => (
              <NumberInput
                module="invoice"
                label="invoice.amountDiscount"
                displayZero
                {...field}
                readOnly
              />
            )}
          />
        </Grid>
        <Grid item xs={3} className={classes.item}>
          <Controller
            name="amountNet"
            control={control}
            render={({ field }) => (
              <NumberInput module="invoice" label="invoice.amountNet" displayZero {...field} readOnly />
            )}
          />
        </Grid>
        <Grid item xs={3} className={classes.item}>
          <Controller
            name="taxAnalysisTotal"
            control={control}
            render={({ field }) => (
              <TextInput module="invoice" label="invoice.taxAnalysis" {...field} readOnly />
            )}
          />
        </Grid>
        <Grid item xs={3} className={classes.item}>
          <Controller
            name="amountTotal"
            control={control}
            render={({ field }) => (
              <NumberInput module="invoice" label="invoice.amountTotal" displayZero {...field} readOnly />
            )}
          />
        </Grid>
        <Grid item xs={3} className={classes.item}>
          <Controller
            name="status"
            control={control}
            render={({ field }) => (
              <InvoiceStatusPicker label="invoice.status.label" withNull {...field} readOnly={false} />
            )}
          />
        </Grid>
        <Grid item xs={3} className={classes.item}>
          <Controller
            name="currencyTpCode"
            control={control}
            render={({ field }) => (
              <TextInput module="invoice" label="invoice.currencyTpCode" {...field} readOnly />
            )}
          />
        </Grid>
        <Grid item xs={3} className={classes.item}>
          <Controller
            name="currencyCode"
            control={control}
            render={({ field }) => (
              <TextInput module="invoice" label="invoice.currencyCode" {...field} readOnly />
            )}
          />
        </Grid>
        <Grid item xs={3} className={classes.item}>
          <Controller
            name="note"
            control={control}
            render={({ field }) => (
              <TextInput module="invoice" label="invoice.note" {...field} readOnly={false} />
            )}
          />
        </Grid>
        <Grid item xs={3} className={classes.item}>
          <Controller
            name="terms"
            control={control}
            render={({ field }) => (
              <TextInput module="invoice" label="invoice.terms" {...field} readOnly />
            )}
          />
        </Grid>
        <Grid item xs={3} className={classes.item}>
          <Controller
            name="paymentReference"
            control={control}
            render={({ field }) => (
              <TextInput module="invoice" label="invoice.paymentReference" {...field} readOnly={false} />
            )}
          />
        </Grid>
      </Grid>
    </>
  );
};

export default withModulesManager(injectIntl(withTheme(withStyles(defaultHeadPanelStyles)(InvoiceHeadPanel))));
