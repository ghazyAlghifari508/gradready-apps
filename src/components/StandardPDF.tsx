import { Document, Page, Text, StyleSheet } from '@react-pdf/renderer';

const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontFamily: 'Helvetica',
  },
  title: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  text: {
    fontSize: 11,
    lineHeight: 1.6,
    marginBottom: 10,
    textAlign: 'justify',
  },
});

export function StandardPDF({ title, content }: { title?: string, content: string }) {
  // Split content by double linebreaks or single linebreaks based on how we want paragraphs.
  // For basic support, we just split by \n.
  const paragraphs = content.split('\n').filter(p => p.trim() !== '');

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {title && <Text style={styles.title}>{title}</Text>}
        {paragraphs.map((para, index) => (
          <Text key={index} style={styles.text}>
            {para}
          </Text>
        ))}
      </Page>
    </Document>
  );
}
