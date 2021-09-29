const logger = (...args) => {
    if (process.env.REACT_APP_PRINT_DEBUG || false) {
        console.log(args);
    }
};
export default logger;
//# sourceMappingURL=logger.js.map