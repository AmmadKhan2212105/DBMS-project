
function App() {
    return {
        regno: '',
        semester: '',
        year: '',
        dataSheet: [],
        semesterGpa: null,
        cgpa: null,

        async fetchData() {
            await this.getDataSheet();
            await this.getSemesterGpa();
            await this.getCgpa();
        },

        async getDataSheet() {
            const dataSheet = await fetch(`/api/datasheet?regno=${this.regno}&semester=${this.semester}&year=${this.year}`)
                .then((res) => res.json());
            this.dataSheet = dataSheet;
        },

        async getSemesterGpa() {
            const semesterGpa = await fetch(`/api/semestergpa?regno=${this.regno}&semester=${this.semester}&year=${this.year}`)
                .then((res) => res.json());
            this.semesterGpa = semesterGpa["Semester GPA"];
        },

        async getCgpa() {
            const cgpa = await fetch(`/api/cgpa?regno=${this.regno}`)
                .then((res) => res.json());
            this.cgpa = cgpa.CGPA;
        }
    };
}