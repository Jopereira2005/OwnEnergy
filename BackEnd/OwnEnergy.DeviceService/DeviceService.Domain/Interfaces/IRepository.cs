using System.Linq.Expressions;

namespace DeviceService.Domain.Interfaces;

public interface IRepository<T>
    where T : class
{
    Task<IEnumerable<T>> GetAllAsync(
        int page,
        int pageSize,
        Expression<Func<T, object>>? orderBy = null,
        bool ascending = true,
        CancellationToken cancellationToken = default
    );
    Task<T?> GetByIdAsync(Guid id);
    Task<T> CreateAsync(T entity, CancellationToken cancellationToken = default);
    Task<T?> UpdateAsync(T entity, CancellationToken cancellationToken = default);
    Task<T?> DeleteAsync(Guid id, CancellationToken cancellationToken = default);
    Task<int> CountAsync();
}
