import { DataSource } from "./data-source.js";


/**
 * This class represents a data source where a REST API is used 
 * to get data from.
 * @extends DataSource
 */
export class RESTDataSource extends DataSource {
	/**
	 * Create a new data source with the specified JSON file as its source of data.
	 * @param url the name of the JSON file to be used as source of data
	 */
	constructor(url) {
		super(url);
	}

	/**
	 * Get data from the specified endpoint.
	 * @param endpoint default an empty string ''
	 * @param method default GET
	 * @param body default an empty body {}
	 * @return a Promise that resolves to the value of the given endpoint
	 */
	async getData(endpoint = '', method = 'GET', body = {}) {
		return super.getData(endpoint, method, body);
		
	}

    /**
	* Get all persons from the REST API.
	* @return a Promise that resolves to an array of persons
	*/
	async getPersons() { 

		return this.getData('/api/persons');

	}

	/**
	* Get the person with specific social security number from the REST API.
	* @param socialSecurityNumber the course code of the course to get
	* @return a Promise that resolves to a person object or {} if the person doesn't exist
	*/
	async getPerson(socialSecurityNumber) { 	
		
		return this.getData('/api/persons/:' + socialSecurityNumber);
		
	}

	/**
	* Add a person to the REST API.
	* @param firstName the first name for the person to be added
	* @param surName the sur name for the person to be added
	* @param address the address of the person to be added
	* @param socialSecurityNumber the social security number for the person to be added
	* @param phone the phone number for the person to be added
	* @return a Promise that resolves to a person object of the person added or an error 
	*         message explaining why the person couldn't be added
	*/
	async addPerson(firstName, surName, address, socialSecurityNumber, phone) { 
		
		return this.getData('/api/persons', 'POST',		
        {'firstName': firstName, 'surName':surName, 'address':address, 'socialSecurityNumber':socialSecurityNumber, 'phone':phone});
	}	

	/**
	* Delete a person from the REST API.
	* @param socialSecurityNumber the social security number for the person to be deleted
	* @return a Promise that resolves to the My course deleted or an error 
	*         message explaining why the course couldn't be deleted
	*/
	async deletePerson(socialSecurityNumber) { 
		
		return this.getData('/api/persons/' + socialSecurityNumber, 'DELETE');
		
	}

	/**
	* Updates the persons information.
	* @param socialSecurityNumber the social security number for the person to be updated
	* @param phone the phone number fot the person to be updated
	* @param firstName the first name fpr the person to be updated
	* @param surName the last name for the person to be updated
	* @param address the address for the person to be updated
	* @return a Promise that resolves to the My course updated or an error 
	*         message explaining why the course's grade couldn't be updated
	*/
	updatePerson(socialSecurityNumber, firstName, surName, address, phone) { //updateMyCourse
		
		return this.getData('/api/persons/' +socialSecurityNumber, 'PUT',
		{'firstName': firstName, 'surName':surName, 'address':address, 'socialSecurityNumber':socialSecurityNumber, 'phone':phone});

	}
	
}
