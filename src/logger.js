class Logger {
	constructor(options = {}) {
		this.debugEnabled = options.debug || false;
		this.infoEnabled = options.info !== false; // default true
		this.warnEnabled = options.warn !== false; // default true
		this.errorEnabled = options.error !== false; // default true
		this.silent = options.silent || false;
	}

	debug(...args) {
		if (!this.silent && this.debugEnabled) {
			console.log("[DEBUG]", ...args);
		}
	}

	info(...args) {
		if (!this.silent && this.infoEnabled) {
			console.info("[INFO]", ...args);
		}
	}

	warn(...args) {
		if (!this.silent && this.warnEnabled) {
			console.warn("[WARN]", ...args);
		}
	}

	error(...args) {
		if (!this.silent && this.errorEnabled) {
			console.error("[ERROR]", ...args);
		}
	}

	log(...args) {
		// Alias for debug to maintain backward compatibility
		this.debug(...args);
	}
}

// Create a default logger instance for backward compatibility
const defaultLogger = new Logger();

module.exports = {
	Logger,
	defaultLogger,
};
