public static class VectorMath
{
    public static double CosineSimilarity(List<float> a, List<float> b)
    {
        if (a.Count != b.Count)
            throw new ArgumentException("Vectors must be the same length");

        double dot = 0, magA = 0, magB = 0;

        for (int i = 0; i < a.Count; i++)
        {
            dot += a[i] * b[i];
            magA += a[i] * a[i];
            magB += b[i] * b[i];
        }

        if (magA == 0 || magB == 0) return 0;

        return dot / (Math.Sqrt(magA) * Math.Sqrt(magB));
    }
}