/**
 * Atlas - Mid Sweden University education database
 * This class represents a very, very simplified version of Atlas with create,
 * read, update, and delete (CRUD) methods for courses and student grades at Miun
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
	async getPersons() { //TODO:Working!
		return this.#dataSource.getPersons();
	}

	/**
	* Get a Miun course from Atlas with the specified course code.
	* @param courseCode the course code of the course to get
	* @return a Promise that resolves to a course object or {} if the course doesn't exist
	*/
	async getCourse(courseCode) {
		return this.#dataSource.getCourse(courseCode);
	}

	/**
	* Get all Persons from from Atlas.
	* @return a Promise that resolves to an array of courses with grade included
	*/
	async getMyCourses() { //
		return this.#dataSource.getMyCourses();
	}

	/**
	* Get a person from Atlas with the specified social security number.
	* @param socialSecurityNumber the social security number of the person to get
	* @return a Promise that resolves to a person object or {} if the person doesn't exist
	*/
	// async getMyCourse(courseCode) { //TODO:remove!
	// 	return this.#dataSource.getMyCourse(courseCode); //TODO:remove!
	// } //TODO:remove!
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
	// async addMyCourse(courseCode, grade) { //TODO:delete
	// 	return this.#dataSource.addMyCourse(courseCode, grade); //TODO:delete
	// } //TODO:delete
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
	updatePerson(firstName, surName, address, socialSecurityNumber, phone) {
		return this.#dataSource.updatePerson(firstName, surName, address, socialSecurityNumber, phone);
	}

	/**
	* Get the grade scale (all grades) used in Atlas.
	* @return a Promise that resolves to an array of grades
	*/
	async getGrades() {
		return this.#dataSource.getGrades();
	}
}
