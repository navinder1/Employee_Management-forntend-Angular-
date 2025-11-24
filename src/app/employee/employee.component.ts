// src/app/employee/employee.component.ts
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { EmployeeService, Employee } from '../services/employee.service';

@Component({
  selector: 'app-employee',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule],
  providers: [EmployeeService],
  templateUrl: './employee.component.html',
  styleUrls: ['./employee.component.css']
})
export class EmployeeComponent implements OnInit {
  employees: Employee[] = [];
  newEmployee: Employee = { full_name: '', email: '' };
  editingEmployee: Employee | null = null;
  showAddForm = false;

  constructor(
    private employeeService: EmployeeService,
    private router: Router
  ) {}

  ngOnInit() {
    if (localStorage.getItem('isLoggedIn') !== 'true') {
      this.router.navigate(['/login']);
    }
    this.loadEmployees();
  }

  loadEmployees() {
    this.employeeService.getAllEmployees().subscribe({
      next: (data) => this.employees = data,
      error: (err) => console.error('Error loading employees:', err)
    });
  }

  addEmployee() {
    if (this.newEmployee.full_name && this.newEmployee.email) {
      this.employeeService.addEmployee(this.newEmployee).subscribe({
        next: () => {
          this.loadEmployees();
          this.newEmployee = { full_name: '', email: '' };
          this.showAddForm = false;
        },
        error: (err) => console.error('Error adding employee:', err)
      });
    }
  }

  editEmployee(employee: Employee) {
    this.editingEmployee = { ...employee };
  }

  updateEmployee() {
    if (this.editingEmployee && this.editingEmployee.id) {
      this.employeeService.updateEmployee(this.editingEmployee.id, this.editingEmployee).subscribe({
        next: () => {
          this.loadEmployees();
          this.editingEmployee = null;
        },
        error: (err) => console.error('Error updating employee:', err)
      });
    }
  }

  cancelEdit() {
    this.editingEmployee = null;
  }

  logout() {
    localStorage.removeItem('isLoggedIn');
    this.router.navigate(['/login']);
  }
}