using UglyToad.PdfPig;

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
                {
                    text += page.Text;
                }

                return text;
            }

            if (extension == ".txt")
            {
                return File.ReadAllText(filePath);
            }

            return "";
        }
    }
}