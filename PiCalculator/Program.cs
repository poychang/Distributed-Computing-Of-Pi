using Microsoft.AspNetCore.Mvc;

var builder = WebApplication.CreateBuilder(args);
var app = builder.Build();

app.UseHttpsRedirection();
app.UseDefaultFiles();
app.UseStaticFiles();
app.MapGet("/api/raw", () => PiEstimator.GetRawData());
app.MapGet("/api/result", () => new { PiEstimate = PiEstimator.GetPiEstimate() });
app.MapPost("/api/calculation", ([FromBody] PiCalculationInput input) =>
{
    PiEstimator.AddResult(input.TotalSamples, input.InsideCircle);
    return PiEstimator.GetPiEstimate();
});
app.Run();

class PiCalculationInput
{
    public int TotalSamples { get; set; }
    public int InsideCircle { get; set; }
}

static class PiEstimator
{
    private static int totalPoints = 0;
    private static int insideCircle = 0;
    private static object lockObject = new object();

    public static void AddResult(int totalSamples, int hits)
    {
        lock (lockObject) // 確保執行緒安全
        {
            totalPoints += totalSamples;
            insideCircle += hits;
        }
    }

    public static double GetPiEstimate()
    {
        lock (lockObject)
        {
            return (insideCircle / (double)totalPoints) * 4;
        }
    }

    public static object GetRawData()
    {
        return new
        {
            TotalSamples = totalPoints,
            InsideCircle = insideCircle,
            PiEstimate = GetPiEstimate(),
        };
    }
}