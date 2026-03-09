using FirstApp.WebAPI.Helpers;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;

namespace FirstApp.WebAPI.Filters
{
    public class ApiResponseFilter : IActionFilter
    {
        public void OnActionExecuting(ActionExecutingContext context)
        {
        }

        public void OnActionExecuted(ActionExecutedContext context)
        {
            if (context.Result is NoContentResult)
                return;

            if (context.Result is ObjectResult objectResult)
            {
                var success = objectResult.StatusCode is >= 200 and < 300;

                var message = success ? "Success" : "Error";

                object? data = objectResult.Value;

                // If controller returned string error, treat it as message
                if (!success && objectResult.Value is string errorMessage)
                {
                    message = errorMessage;
                    data = null;
                }

                var wrapped = new ApiResponse<object>(
                    success,
                    message,
                    data
                    // objectResult.Value
                );

                context.Result = new ObjectResult(wrapped)
                {
                    StatusCode = objectResult.StatusCode
                };
            }
        }
    }
}