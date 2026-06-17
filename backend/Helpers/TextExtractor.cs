using UglyToad.PdfPig;
using DocumentFormat.OpenXml.Packaging;
using DocumentFormat.OpenXml.Wordprocessing;

namespace AI.DocumentAssistant.API.Helpers
{
    public static class TextExtractor
    {
        public static string ExtractText(string filePath)
        {
            var extension = Path.GetExtension(filePath).ToLower();

            if (extension == ".pdf")
            {
                using var document = PdfDocument.Open(filePath);
                var text = "";
                foreach (var page in document.GetPages())
                    text += page.Text;
                return text;
            }

            if (extension == ".txt")
            {
                return File.ReadAllText(filePath);
            }

            if (extension == ".docx")
            {
                using var doc = WordprocessingDocument.Open(filePath, false);
                var body = doc.MainDocumentPart?.Document?.Body;
                if (body == null) return "";

                // Join all paragraphs with newlines to preserve structure
                var paragraphs = body.Descendants<Paragraph>()
                    .Select(p => p.InnerText)
                    .Where(t => !string.IsNullOrWhiteSpace(t));

                return string.Join("\n", paragraphs);
            }

            return "";
        }
    }
}