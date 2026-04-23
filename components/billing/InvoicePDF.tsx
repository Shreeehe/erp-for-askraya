import { Document, Page, Text, View, StyleSheet, Image } from '@react-pdf/renderer'
import { formatINR } from '@/lib/utils'

const styles = StyleSheet.create({
  page: { fontFamily: 'Helvetica', fontSize: 10, color: '#1a1a1a', backgroundColor: '#fff' },

  // Header
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', padding: '28 32 20 32', borderBottom: '3 solid #22d3ee', marginBottom: 20 },
  logoBlock: { flexDirection: 'column' },
  logoText: { fontSize: 22, fontFamily: 'Helvetica-Bold', color: '#052044', letterSpacing: 1 },
  logoSub: { fontSize: 9, color: '#22d3ee', marginTop: 2 },
  invoiceBlock: { alignItems: 'flex-end' },
  invoiceTitle: { fontSize: 26, fontFamily: 'Helvetica-Bold', color: '#052044', marginBottom: 4 },
  invoiceMeta: { fontSize: 10, color: '#444', lineHeight: 1.6 },

  // Billed to
  billedSection: { paddingHorizontal: 32, marginBottom: 20 },
  billedLabel: { fontSize: 10, fontFamily: 'Helvetica-Bold', marginBottom: 4 },
  billedText: { fontSize: 10, color: '#333', lineHeight: 1.6 },

  // Table
  table: { marginHorizontal: 32, marginBottom: 20 },
  tableHeader: { flexDirection: 'row', borderBottom: '1.5 solid #052044', paddingBottom: 6, marginBottom: 6 },
  tableRow: { flexDirection: 'row', paddingVertical: 6, borderBottom: '0.5 solid #e5e7eb' },
  colDesc: { flex: 3 },
  colDays: { flex: 1, textAlign: 'center' },
  colUnit: { flex: 1, textAlign: 'right' },
  colAmount: { flex: 1, textAlign: 'right' },
  headerText: { fontSize: 10, fontFamily: 'Helvetica-Bold', color: '#052044' },
  cellText: { fontSize: 10, color: '#333' },
  cellSubText: { fontSize: 9, color: '#666', marginTop: 2 },

  // Summary row
  summaryRow: { flexDirection: 'row', justifyContent: 'space-between', marginHorizontal: 32, marginTop: 16, marginBottom: 6 },
  careManager: { fontSize: 10, color: '#333' },
  totalsBlock: { alignItems: 'flex-end' },
  totalLine: { flexDirection: 'row', justifyContent: 'space-between', width: 200, marginBottom: 3 },
  totalLabel: { fontSize: 10, color: '#555' },
  totalValue: { fontSize: 10, color: '#333' },
  grandTotalLine: { flexDirection: 'row', justifyContent: 'space-between', width: 200, borderTop: '1 solid #052044', paddingTop: 4, marginTop: 2 },
  grandLabel: { fontSize: 11, fontFamily: 'Helvetica-Bold', color: '#052044' },
  grandValue: { fontSize: 11, fontFamily: 'Helvetica-Bold', color: '#052044' },

  divider: { borderBottom: '1 solid #e5e7eb', marginHorizontal: 32, marginVertical: 16 },

  // Footer
  footer: { flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 32, marginTop: 8 },
  footerCol: { flex: 1 },
  footerHeading: { fontSize: 12, fontFamily: 'Helvetica-Bold', color: '#052044', marginBottom: 6 },
  footerText: { fontSize: 9, color: '#444', lineHeight: 1.7 },
})

interface InvoicePDFProps {
  invoice: {
    invoice_number: string
    issued_at: string
    care_manager?: string
    gst_rate: number
    subtotal: number
    gst_amount: number
    total_amount: number
    payment_reference?: string
    payment_method?: string
    payment_date?: string
    line_items: {
      description: string
      sub_description?: string
      days?: string
      unit_rate: number
      amount: number
    }[]
  }
  patient: {
    full_name: string
    address?: string
    city?: string
  }
}

export function InvoicePDF({ invoice, patient }: InvoicePDFProps) {
  const isGSTExempt = invoice.gst_rate === 0

  return (
    <Document>
      <Page size="A4" style={styles.page}>

        {/* Header */}
        <View style={styles.header}>
          <View style={styles.logoBlock}>
            <Text style={styles.logoText}>aksraya®</Text>
            <Text style={styles.logoSub}>health care</Text>
          </View>
          <View style={styles.invoiceBlock}>
            <Text style={styles.invoiceTitle}>Invoice</Text>
            <Text style={styles.invoiceMeta}>Invoice No. {invoice.invoice_number}</Text>
            <Text style={styles.invoiceMeta}>Date: {new Date(invoice.issued_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</Text>
          </View>
        </View>

        {/* Billed to */}
        <View style={styles.billedSection}>
          <Text style={styles.billedLabel}>Billed to:</Text>
          <Text style={styles.billedText}>C/o {patient.full_name}</Text>
          {patient.address && <Text style={styles.billedText}>{patient.address}</Text>}
          {patient.city && <Text style={styles.billedText}>{patient.city}</Text>}
        </View>

        {/* Table */}
        <View style={styles.table}>
          <View style={styles.tableHeader}>
            <Text style={[styles.headerText, styles.colDesc]}>Description</Text>
            <Text style={[styles.headerText, styles.colDays]}>Days</Text>
            <Text style={[styles.headerText, styles.colUnit]}>Unit</Text>
            <Text style={[styles.headerText, styles.colAmount]}>Amount</Text>
          </View>
          {invoice.line_items.map((item, i) => (
            <View key={i} style={styles.tableRow}>
              <View style={styles.colDesc}>
                <Text style={styles.cellText}>{item.description}</Text>
                {item.sub_description && <Text style={styles.cellSubText}>{item.sub_description}</Text>}
              </View>
              <Text style={[styles.cellText, styles.colDays]}>{item.days ?? '-'}</Text>
              <Text style={[styles.cellText, styles.colUnit]}>₹ {item.unit_rate.toLocaleString('en-IN')}</Text>
              <Text style={[styles.cellText, styles.colAmount]}>₹ {item.amount.toLocaleString('en-IN')}</Text>
            </View>
          ))}
        </View>

        <View style={styles.divider} />

        {/* Summary */}
        <View style={styles.summaryRow}>
          <Text style={styles.careManager}>
            {invoice.care_manager ? `Care Manager : ${invoice.care_manager}` : ''}
          </Text>
          <View style={styles.totalsBlock}>
            <View style={styles.totalLine}>
              <Text style={styles.totalLabel}>Sub-Total</Text>
              <Text style={styles.totalValue}>₹ {invoice.subtotal.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</Text>
            </View>
            <View style={styles.totalLine}>
              <Text style={styles.totalLabel}>GST ({isGSTExempt ? '0% - exempted' : `${invoice.gst_rate}%`})</Text>
              <Text style={styles.totalValue}>₹ {invoice.gst_amount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</Text>
            </View>
            <View style={styles.grandTotalLine}>
              <Text style={styles.grandLabel}>Total</Text>
              <Text style={styles.grandValue}>₹ {invoice.total_amount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</Text>
            </View>
          </View>
        </View>

        <View style={styles.divider} />

        {/* Footer */}
        <View style={styles.footer}>
          <View style={styles.footerCol}>
            <Text style={styles.footerHeading}>Contact</Text>
            <Text style={styles.footerText}>+91 831 096 2174</Text>
            <Text style={styles.footerText}>support@aksrayahealthcare.com</Text>
            <Text style={styles.footerText}>341/9, Aksraya healthcare</Text>
            <Text style={styles.footerText}>Near B S Carmel School</Text>
            <Text style={styles.footerText}>Bommasandra, Bengaluru – 560099</Text>
            <Text style={styles.footerText}>Karnataka, India</Text>
          </View>
          <View style={styles.footerCol}>
            <Text style={styles.footerHeading}>Payment Info</Text>
            {invoice.payment_reference && <Text style={styles.footerText}>Ref No: {invoice.payment_reference}</Text>}
            {invoice.payment_method && <Text style={styles.footerText}>Bank : {invoice.payment_method}</Text>}
            {invoice.payment_date && <Text style={styles.footerText}>Date & Time: {invoice.payment_date}</Text>}
          </View>
        </View>

      </Page>
    </Document>
  )
}
