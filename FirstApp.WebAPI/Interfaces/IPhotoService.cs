using CloudinaryDotNet.Actions;

namespace FirstApp.WebAPI.Interfaces
{
    public interface IPhotoService
    {
        Task<ImageUploadResult> UploadPhotoAsync(IFormFile file);
        Task<DeletionResult> DeletePhotoAsync(string publicId);
    }
}
