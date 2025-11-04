// utils.ts
// รวมฟังก์ชันช่วยเหลือทั่วไปของโปรเจกต์

export function sayHello(name: string): string {
  return `Hello, ${name}!`;
}

export function add(a: number, b: number): number {
  return a + b;
}

export function isEmpty(value: unknown): boolean {
  return value === null || value === undefined || value === '';
}

// ฟังก์ชันรวม class สำหรับ Tailwind หรือ class string ปกติ
export function cn(...classes: (string | undefined | null | boolean)[]) {
  return classes.filter(Boolean).join(' ');
}
