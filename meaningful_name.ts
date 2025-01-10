class SubjectMarks {
  subjectName: string;
  Marks: number;

  constructor(subjectName: string, Marks: number) {
    this.subjectName = subjectName;
    this.Marks = Marks;
  }
}

class Student {
  name: string;
  rollNumber: number;
  subjectMarks: SubjectMarks[];

  constructor(name: string, rollNumber: number, subjectMarks: SubjectMarks[]) {
    this.name = name;
    this.rollNumber = rollNumber;
    this.subjectMarks = subjectMarks;
  }
}

const displayStudentDetails = (
  rollNumber: number,
  students: Student[]
): void => {
  const student = students.find((student) => student.rollNumber === rollNumber);

  if (!student) {
    console.log("Student not found: " + rollNumber);
    return;
  }

  const totalMarks = student.subjectMarks.reduce(
    (sum, subjectMarks) => sum + subjectMarks.Marks,
    0
  );
  const percentage = (totalMarks / (student.subjectMarks.length * 100)) * 100;

  console.log("Student Name: " + student.name);
  console.log("Roll Number: " + student.rollNumber);
  console.log("Subject Details:");
  student.subjectMarks.forEach((subjectMarks) => {
    console.log("  " + subjectMarks.subjectName + ": " + subjectMarks.Marks);
  });
  console.log("Total Marks: " + totalMarks);
  console.log("Percentage: " + percentage.toFixed(2) + "%");
  console.log("----------------------");
};

const studentList: Student[] = [
  new Student("Alice", 101, [
    new SubjectMarks("Math", 85),
    new SubjectMarks("English", 90),
    new SubjectMarks("Science", 78),
  ]),
  new Student("Bob", 102, [
    new SubjectMarks("Math", 70),
    new SubjectMarks("English", 88),
    new SubjectMarks("Science", 92),
  ]),
  new Student("Charlie", 103, [
    new SubjectMarks("Math", 95),
    new SubjectMarks("English", 80),
    new SubjectMarks("Science", 85),
  ]),
];

displayStudentDetails(101, studentList);
