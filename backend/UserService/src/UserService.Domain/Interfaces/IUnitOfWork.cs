using UserService.Domain.Interfaces.Persistence;

namespace UserService.Domain.Interfaces;

public interface IUnitOfWork
{
    public IUserRepository Users { get; }
    public IRefreshTokenRepository RefreshTokens { get; }

    Task<bool> SaveChangesAsync(CancellationToken cancellationToken = default);
    Task BeginTransactionAsync(CancellationToken cancellationToken = default);
    Task CommitTransactionAsync(CancellationToken cancellationToken = default);
    Task RollbackTransactionAsync(CancellationToken cancellationToken = default);
    Task DisposeTransactionAsync(CancellationToken cancellationToken = default);
}
