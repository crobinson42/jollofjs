/**
 * Created by iyobo on 2016-08-24.
 */
const config = require('../configurator').settings;
const log = require('../log')
const path = require('path');
/**
 * Handles uploaded file storage and persistence within eluvianJS
 */
class FileStorage {

	* store( file, opts = {} ) {
		try {
			//Only process file upload if it has no 'key' field i.e. File hasn't been uploaded before
			if(file['key'])
				return file;

			let engineName = opts.engineOverride || config.fileStorage.defaultEngine;

			let engine = require(path.join(__dirname, 'engines', engineName));
			if (!engine) {
				log.warn(`No such engine name: ${engineName}. Defaulting to local`)
				engine = require('./engines/local')
			}

			const res= yield engine.store(file, opts);

			return res;
		} catch (err) {
			log.error(`There was an error storing the file`, err.stack);
			throw err;
		}
	}

	* retrieve( path, opts = {} ) {

	}

	* delete( path, opts = {} ) {

	}

}

module.exports = new FileStorage();