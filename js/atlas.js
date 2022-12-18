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
	* @return a Promise that resolves to an array of courses
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
	* Get a My course from Atlas with the specified course code.
	* @param courseCode the course code of the course to get
	* @return a Promise that resolves to a course object or {} if the course doesn't exist
	*/
	async getMyCourse(courseCode) {
		return this.#dataSource.getMyCourse(courseCode);
	}

	/**
	* Add a person to Atlas.
	* @param courseCode the course code for the course to be added
	* @param grade the student's grade in the course being added
	* @return a Promise that resolves to the My course added or an error 
	*         message explaining why the course couldn't be added
	*/
	// async addMyCourse(courseCode, grade) {
	// 	return this.#dataSource.addMyCourse(courseCode, grade);
	// }
    async addPerson(firstName, surName, address, socialSecurityNumber, phone) {
		return this.#dataSource.addPerson(firstName, surName, address, socialSecurityNumber, phone);
	}

	/**
	* Delete a My course in Atlas.
	* @param courseCode the course code of the course to be deleted
	* @return a Promise that resolves to the My course deleted or an error 
	*         message explaining why the course couldn't be deleted
	*/
	async deletePerson(socialSecurityNumber) {
		return this.#dataSource.deletePerson(socialSecurityNumber);
	}

	/**
	* Update the grade for a My course in Atlas.
	* @param courseCode the course code of the My course to update the grade for
	* @param grade the new grade
	* @return a Promise that resolves to the My course updated or an error 
	*         message explaining why the course's grade couldn't be updated
	*/
	updateMyCourse(courseCode, grade) {
		return this.#dataSource.updateMyCourse(courseCode, grade);
	}

	/**
	* Get the grade scale (all grades) used in Atlas.
	* @return a Promise that resolves to an array of grades
	*/
	async getGrades() {
		return this.#dataSource.getGrades();
	}
}
