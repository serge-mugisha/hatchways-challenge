import axios from 'axios';
import React, { useEffect, useState } from 'react';
import '../assets/styles/index.scss';

export default function App() {
  const [studentsData, setStudentsData] = useState([]);
  const [filteredByNames, setFilteredByNames] = useState([]);
  const [filteredByTags, setFilteredByTags] = useState([]);
  const [students, setStudents] = useState([]);
  const [expandedGrades, setExpandedGrades] = useState({});

  useEffect(() => {
    axios
      .get('https://api.hatchways.io/assessment/students')
      .then((res) => {
        if (res.data.students) setStudentsData(res.data.students);
        else setStudentsData([]);
      })
      .catch((err) => {
        // eslint-disable-next-line no-console
        console.log('Fetch Error: ', err);
      });
  }, []);

  useEffect(() => {
    setStudents(studentsData);
  }, [studentsData]);

  const toogleGrades = (id) => {
    setExpandedGrades((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleTags = (e, id) => {
    if (e.key === 'Enter') {
      const newStudents = studentsData.map((student) =>
        student.id === id ? { ...student, tags: [...(student.tags || []), e.target.value] } : student
      );
      setStudentsData(newStudents);
    }
  };

  const filterNames = (value) => {
    if (value === '') {
      setStudents(filteredByTags.length !== 0 ? filteredByTags : studentsData);
      setFilteredByNames([]);
    } else {
      const dataToFilter = filteredByTags.length !== 0 ? filteredByTags : studentsData;
      const filterResults = dataToFilter.filter(
        (student) => student.firstName.toLowerCase().includes(value) || student.lastName.toLowerCase().includes(value)
      );
      setFilteredByNames(filterResults);
      setStudents(filterResults);
    }
  };

  const filterTags = (value) => {
    if (value === '') {
      setStudents(filteredByNames.length !== 0 ? filteredByNames : studentsData);
      setFilteredByTags([]);
    } else {
      const dataToFilter = filteredByNames.length !== 0 ? filteredByNames : studentsData;
      let filterResults = [];
      dataToFilter.forEach((student) => {
        let tags = [];
        if (student.tags) tags = student.tags.filter((tag) => tag.includes(value));
        filterResults = tags.length !== 0 ? [...filterResults, student] : filterResults;
      });
      setFilteredByTags(filterResults);
      setStudents(filterResults);
    }
  };

  return (
    <>
      <div className="container">
        <input
          type="text"
          className="filter-input"
          onChange={(e) => filterNames(e.target.value)}
          placeholder="Search by name"
        />
        <input
          type="text"
          className="filter-input"
          onChange={(e) => filterTags(e.target.value)}
          placeholder="Search by tag"
        />
        <div className="students-container">
          {students.length !== 0 ? (
            students.map((student) => {
              const grades = student.grades.map(Number);
              const average = grades.reduce((prev, curr) => prev + curr) / grades.length;
              return (
                <div key={student.id} className="student">
                  <div className="avatar">
                    <img src={student.pic} alt="Student Avatar" />
                  </div>
                  <div className="content">
                    <h1>
                      {student.firstName.toUpperCase()} {student.lastName.toUpperCase()}
                    </h1>
                    <div className="details">
                      <p>
                        Email:
                        {student.email}
                      </p>
                      <p>
                        Company:
                        {student.company}
                      </p>
                      <p>
                        Skill:
                        {student.skill}
                      </p>
                      <p>
                        Average:
                        {average} %
                      </p>
                      {expandedGrades[student.id] ? (
                        <ul>
                          {student.grades.map((score, index) => (
                            <li key={index}>
                              Test
                              {index + 1}:{score}
                            </li>
                          ))}
                        </ul>
                      ) : null}

                      {student.tags
                        ? student.tags.map((tag, index) => (
                            <span className="tag" key={index}>
                              {tag}
                            </span>
                          ))
                        : null}
                      <div>
                        <input
                          type="text"
                          className="input"
                          onKeyDown={(e) => handleTags(e, student.id)}
                          placeholder="Add tag"
                        />
                      </div>
                    </div>
                  </div>
                  <div className="expand">
                    <button type="button" className="btn" onClick={() => toogleGrades(student.id)}>
                      {expandedGrades[student.id] ? '-' : '+'}
                    </button>
                  </div>
                </div>
              );
            })
          ) : (
            <h1> No results </h1>
          )}
        </div>
      </div>
    </>
  );
}
