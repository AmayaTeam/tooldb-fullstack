def permission_required(permission):
    def decorator(func):
        def wrapper(cls, root, info, *args, **kwargs):
            if not info.context.user.has_perm(permission):
                raise PermissionError(
                    "You do not have permission to perform this action."
                )
            return func(cls, root, info, *args, **kwargs)

        return wrapper

    return decorator


def query_permission_required(permission):
    def decorator(func):
        def wrapper(cls, info, *args, **kwargs):
            if not info.context.user.has_perm(permission):
                raise PermissionError(
                    "You do not have permission to perform this action."
                )
            return func(cls, info, *args, **kwargs)

        return wrapper

    return decorator
