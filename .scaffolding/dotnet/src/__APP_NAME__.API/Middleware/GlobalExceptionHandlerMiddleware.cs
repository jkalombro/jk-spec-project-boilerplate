using Microsoft.AspNetCore.Mvc;
using __APP_NAME__.Application.Common.Exceptions;

namespace __APP_NAME__.API.Middleware;

public class GlobalExceptionHandlerMiddleware
{
    private readonly RequestDelegate _next;
    private readonly ILogger<GlobalExceptionHandlerMiddleware> _logger;

    public GlobalExceptionHandlerMiddleware(
        RequestDelegate next,
        ILogger<GlobalExceptionHandlerMiddleware> logger)
    {
        _next = next;
        _logger = logger;
    }

    public async Task InvokeAsync(HttpContext context)
    {
        try
        {
            await _next(context);
        }
        catch (Exception exception)
        {
            _logger.LogError(exception, "Unhandled exception: {Message}", exception.Message);
            await HandleExceptionAsync(context, exception);
        }
    }

    private static async Task HandleExceptionAsync(HttpContext context, Exception exception)
    {
        var (statusCode, title, extensions) = exception switch
        {
            ValidationException validationEx => (
                StatusCodes.Status400BadRequest,
                "One or more validation errors occurred.",
                (IDictionary<string, object?>)new Dictionary<string, object?> { ["errors"] = validationEx.Errors }),
            NotFoundException => (
                StatusCodes.Status404NotFound,
                exception.Message,
                (IDictionary<string, object?>)new Dictionary<string, object?>()),
            _ => (
                StatusCodes.Status500InternalServerError,
                "An unexpected error occurred.",
                (IDictionary<string, object?>)new Dictionary<string, object?>())
        };

        var problemDetails = new ProblemDetails
        {
            Type = $"https://httpstatuses.com/{statusCode}",
            Title = title,
            Status = statusCode,
            Detail = exception.Message,
            Instance = context.Request.Path,
        };

        foreach (var (key, value) in extensions)
            problemDetails.Extensions[key] = value;

        problemDetails.Extensions["traceId"] = context.TraceIdentifier;

        context.Response.StatusCode = statusCode;
        context.Response.ContentType = "application/problem+json";

        await context.Response.WriteAsJsonAsync(problemDetails);
    }
}
