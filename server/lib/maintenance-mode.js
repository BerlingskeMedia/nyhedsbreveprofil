const Boom = require("@hapi/boom");
const showMaintenanceMessage = function (request) {
    const maintenancePage = process.env.MAINTENANCE_PAGE === 'true' || false;
    const goThoughMaintenancePageCookieName = process.env.GO_THOUGH_MAINTENANCE_PAGE_COOKIE_NAME || 'go_thought_maintenance_page';
    const goThoughMaintenancePageString = process.env.GO_THOUGH_MAINTENANCE_PAGE_STRING || 'allowed'

    if (maintenancePage &&
        request.state[goThoughMaintenancePageCookieName] !== goThoughMaintenancePageString
    ) {
        throw Boom.serverUnavailable('Maintenance mode on');
    }
}

exports.showMaintenanceMessage = showMaintenanceMessage;
