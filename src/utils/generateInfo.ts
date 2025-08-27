export default function generateInfo () {
    const roles = ['Developer', 'Designer', 'Manager', 'Analyst'];
    const statuses = ['Active', 'Inactive'];
    const departments = ['Engineering', 'Design', 'Product', 'info'];
    const sampleNames = [
        'John Doe', 'Jane Smith', 'Bob Johnson', 'Alice Brown', 'Charlie Wilson',
        'Emily Davis', 'Michael Miller', 'Sarah Wilson', 'David Lee', 'Laura Taylor',
        'Chris Martin', 'Olivia Harris', 'Daniel Clark', 'Sophia Lewis', 'Andrew Young',
        'Grace King', 'Matthew Scott', 'Hannah Turner', 'Joseph Allen', 'Mia Wright',
        'Samuel Lopez', 'Ava Hill', 'Ethan Green', 'Isabella Adams', 'Ryan Baker'
    ];

    return sampleNames.map((name, index) => ({
        id: index + 1,
        name,
        email: name.toLowerCase().replace(/ /g, '.') + '@example.com',
        role: roles[index % roles.length],
        status: statuses[index % statuses.length],
        joinDate: `2023-0${(index % 9) + 1}-${(index % 28) + 1}`,
        department: departments[index % departments.length],
        images: [],
        longText: "This is a very long text that should be truncated in the table cell, but we want to be able to view the full content in a modal when we click on the cell.",
    }));
};