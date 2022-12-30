/**
 * This class represents a very, very simplified version of Atlas with create,
 * read, update, and delete (CRUD) methods for persons with their information
 * Almost all methods return a Promise that is fulfilled with the requested data 
 * or rejected if an error occurs.
 */
export class Atlas {
	#dataSource;

	/**
	 * Create a new Atlas instance with the specified source for its data.
	 * @param dataSource the data source to be used
	 */
	constructor(dataSource) {
		this.#dataSource = dataSource;
	}

	/**
	* Get all Persons from Atlas.
	* @return a Promise that resolves to an array of persons
	*/
	async getPersons() { 		
		return this.#dataSource.getPersons();
	}

	/**
	* Get a person from Atlas with the specified social security number.
	* @param socialSecurityNumber the social security number of the person to get
	* @return a Promise that resolves to a person object or {} if the person doesn't exist
	*/	
	async getPerson(socialSecurityNumber) {
		return this.#dataSource.getPerson(socialSecurityNumber);
	}

	/**
	* Add a person to Atlas.
	* @param firstName the first name of the person to be added
	* @param surName the sur name of the person to be added
	* @param address the address of the person to be added
	* @param socialSecurityNumber the social security number for the person to be added
	* @param phone the phone of the person to be added
	* @return a Promise that resolves to the person added or an error 
	*         message explaining why the course couldn't be added
	*/	
    async addPerson(firstName, surName, address, socialSecurityNumber, phone) {
		return this.#dataSource.addPerson(firstName, surName, address, socialSecurityNumber, phone);
	}

	/**
	* Delete a person in Atlas.
	* @param socialSecurityNumber the social security number of the person to be deleted
	* @return a Promise that resolves to the person deleted or an error 
	*         message explaining why the person couldn't be deleted
	*/
	async deletePerson(socialSecurityNumber) {
		return this.#dataSource.deletePerson(socialSecurityNumber);
	}

	/**
	* Update a person to Atlas.
	* @param firstName the first name of the person to be updated
	* @param surName the sur name of the person to be updated
	* @param address the address of the person to be updated
	* @param socialSecurityNumber the social security number for the person to be updated
	* @param phone the phone of the person to be updated
	* @return a Promise that resolves to the person added or an error 
	*         message explaining why the course couldn't be added
	*/	
	updatePerson(socialSecurityNumber, firstName, surName, address, phone) {
		return this.#dataSource.updatePerson(socialSecurityNumber, firstName, surName, address, phone);
	}
	
}
