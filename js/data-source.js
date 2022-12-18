/**
 * This is a base class for data sources to be used in an Atlas instance. 
 * It must not be used directly but extended by other classes to provide 
 * concrete implementations. If no special reason exists, all subclasses 
 * should call super.getData() to fetch their data.
 */
export class DataSource {
	/** The URL to the data source (eg. a local/remote JSON file or a REST API). */
	#url;
	
	/**
	 * Create a new data source with the specified URL as its source.
	 * @param url an url to be used as source of data
	 */
	constructor(url) {
		this.#url = url;
	}
	
	/**
	 * Get data from the data source. The provided endpoint will be appended
	 * to the url used as data source.
	 * @param endpoint default an empty string ''
	 * @param method default GET
	 * @param body default an empty body {}
	 * @return a Promise that resolves to a Response object from the Fetch API
	 */
    async getData(endpoint = '', method = 'GET', body = {}) {
		const headers = {
			'Accept': 'application/json'
		}

		const useBody = method.toUpperCase() !== 'GET';
		const requestInfo = {
			method: method,
			headers: headers
		};

		if (useBody) {
			requestInfo['body'] = JSON.stringify(body); // data needs to be parsed into JSON
			requestInfo['headers']['Content-Type'] = 'application/json'; // we are sending json
		}
		
		return fetch(this.#url + endpoint, requestInfo);
	}
}