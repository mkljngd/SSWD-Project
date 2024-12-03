const roleMiddleware = (requiredRoles) => {
    return (req, res, next) => {
        if (!req.user || !requiredRoles.includes(req.user.role)) {
            return res.status(403).json({ message: 'Access Denied: Insufficient Permissions' });
        }
        next();
    };
};

module.exports = roleMiddleware;