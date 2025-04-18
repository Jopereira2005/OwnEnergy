using UserService.Domain.Models.Entities;

namespace UserService.Domain.Interfaces.Persistence;

public interface IUserRepository : IRepository<User>
{
    Task<User> GetByEmailAsync(string email);
    Task<User> GetByUsernameAsync(string username);
    Task<User> GetByPhoneNumberAsync(string phoneNumber);
    Task<IEnumerable<User>> GetByRoleAsync(string role);
}
