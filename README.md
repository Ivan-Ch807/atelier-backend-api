# Лабораторно-практична робота №5: Розширення бекенд-додатку та реалізація REST API

**Предметна область:** Інформаційна система ательє з пошиття одягу

---

## 1. Опис сутностей та зв'язків

У проекті реалізовано дві пов'язані сутності за допомогою TypeORM:

1. **Client (`clients`)** — зберігає інформацію про клієнтів ательє (`id`, `fullName`, `phone`, `email`).
2. **Order (`orders`)** — зберігає інформацію про замовлення на пошиття та ремонт одягу (`id`, `description`, `price`, `status`, `clientId`).

**Тип зв'язку:** `One-To-Many` (Один до Багатьох) між `Client` та `Order` (один клієнт може мати кілька замовлень, але кожне замовлення належить конкретному клієнту).

---

## 2. Перелік API Ендпоінтів

### Клієнти (`/v1/clients`)

- `GET /v1/clients` — отримати список усіх клієнтів
- `GET /v1/clients/:id` — отримати клієнта за ID (включаючи масив його замовлень)
- `POST /v1/clients` — створити нового клієнта
- `PATCH /v1/clients/:id` — оновити дані клієнта
- `DELETE /v1/clients/:id` — видалити клієнта

### Замовлення (`/v1/orders`)

- `GET /v1/orders` — отримати список усіх замовлень (з підтягуванням об'єкта `client` через JOIN)
- `GET /v1/orders/:id` — отримати замовлення за ID (з деталями про клієнта)
- `POST /v1/orders` — створити нове замовлення
- `PATCH /v1/orders/:id` — оновити статус або опис замовлення
- `DELETE /v1/orders/:id` — видалити замовлення

---

## 3. Результати тестування (Postman Screenshots)

### 1. Створення клієнта (`POST /v1/clients`)

![POST Client](docs/screenshots/post_clients.jpg)

### 2. Створення замовлення (`POST /v1/orders`)

![POST Order](docs/screenshots/post_orders.jpg)

### 3. Отримання списку замовлень з автоматичним JOIN (`GET /v1/orders`)

![GET Orders JOIN](docs/screenshots/get_orders.jpg)

### 4. Отримання клієнта з масивом замовлень (`GET /v1/clients/1`)

![GET Client Orders](docs/screenshots/get_clients.jpg)

<br />
<hr />
<br />

# Лабораторно-практична робота №6: Впровадження сервісного шару, валідації та DTO

**Предметна область:** Інформаційна система ательє з пошиття одягу

---

## 1. Архітектура додатка та розділення відповідальності

У ході виконання рефакторингу проект було переведено на багаторівневу сервісну архітектуру з чітким розділенням відповідальності (Separation of Concerns):

- **Middleware (Валідація):** Перевіряє вхідні HTTP-запити (`req.body`) до того, як вони потраплять у контролер. Забезпечує коректність даних та викидає помилку `400 Bad Request` у разі невідповідності правилам.
- **Controller (Оркестрація):** Приймає HTTP-запит, звертається до відповідного сервісу для виконання бізнес-логіки, загортає отримані результати у об'єкти `ResponseDTO` та повертає структуровану HTTP-відповідь клієнту.
- **Service (Бізнес-логіка):** Інкапсулює всю бізнес-логіку роботи з конкретною сутністю (`ClientService`, `OrderService`), взаємодіє з репозиторієм TypeORM.
- **Repository (Доступ до даних):** Шар TypeORM для виконання SQL-запитів до бази даних PostgreSQL.

---

## 2. Приклади реалізації коду

### 2.1. Middleware-функція валідації (`validatorCreateClient.ts`)

```typescript
import { Request, Response, NextFunction } from 'express';
import validator from 'validator';
import { CustomError } from 'utils/response/custom-error/CustomError';
import { ErrorValidation } from 'utils/response/custom-error/types';

export const validatorCreateClient = (req: Request, res: Response, next: NextFunction) => {
  let { fullName, phone, email } = req.body;
  const errorsValidation: ErrorValidation[] = [];

  fullName = !fullName ? '' : String(fullName);
  phone = !phone ? '' : String(phone);
  email = !email ? '' : String(email);

  if (validator.isEmpty(fullName)) {
    errorsValidation.push({ fullName: 'Full name is required' });
  }

  if (validator.isEmpty(phone)) {
    errorsValidation.push({ phone: 'Phone number is required' });
  }

  if (!validator.isEmpty(email) && !validator.isEmail(email)) {
    errorsValidation.push({ email: 'Email is invalid' });
  }

  if (errorsValidation.length !== 0) {
    const customError = new CustomError(
      400,
      'Validation',
      'Create client validation error',
      null,
      null,
      errorsValidation,
    );
    return next(customError);
  }

  return next();
};
```

### 2.2. Сервіс-клас бізнес-логіки (`OrderService.ts`)

```typescript
import { getRepository, Repository } from 'typeorm';
import { Order } from '../orm/entities/orders/Order';

export class OrderService {
  private get repository(): Repository<Order> {
    return getRepository(Order);
  }

  async findAll(): Promise<Order[]> {
    return await this.repository
      .createQueryBuilder('order')
      .leftJoinAndSelect('order.client', 'client')
      .getMany();
  }

  async findOne(id: number): Promise<Order null |> {
    return await this.repository
      .createQueryBuilder('order')
      .leftJoinAndSelect('order.client', 'client')
      .where('order.id = :id', { id })
      .getOne();
  }

  async create(data: Partial<Order>): Promise<Order null |> {
    const targetClientId = Number(data.clientId);
    const order = this.repository.create({
      description: data.description,
      price: data.price,
      status: data.status || 'NEW',
      clientId: targetClientId,
      client: { id: targetClientId } as any,
    });
    const savedOrder = await this.repository.save(order);
    return await this.findOne(savedOrder.id);
  }

  async update(id: number, data: Partial<Order>): Promise<Order null |> {
    await this.repository.update(id, data);
    return await this.findOne(id);
  }

  async delete(id: number): Promise<void> {
    await this.repository.delete(id);
  }
}
```

### 2.3. Клас ResponseDTO (`OrderResponseDTO.ts`)

```typescript
import { Order } from '../orm/entities/orders/Order';

export class OrderResponseDTO {
  id: number;
  description: string;
  price: number;
  status: string;
  clientId: number;
  clientName?: string;
  createdAt: Date;

  constructor(order: Order) {
    this.id = order.id;
    this.description = order.description;
    this.price = Number(order.price);
    this.status = order.status;
    this.clientId = order.clientId;
    if (order.client) {
      this.clientName = order.client.fullName;
    }
    this.createdAt = order.created_at;
  }
}
```

---

## 3. Результати тестування у Postman

### 3.1. Некоректний запит — помилка валідації 400 Bad Request від Middleware

![Validation Error 400](docs/screenshots/post_clients_middleware_error.jpg)

### 3.2. Успішне створення клієнта у форматі ClientResponseDTO (201 Created)

![Create Client DTO](docs/screenshots/post_clients_DTO.jpg)

### 3.3. Отримання списку замовлень у форматі OrderResponseDTO (200 OK)

![GET Orders DTO](docs/screenshots/get_orders_DTO.jpg)

### 3.4. Оновлення замовлення та переприв'язка клієнта (PATCH /v1/orders/:id)

![PATCH Order DTO](docs/screenshots/patch_orders_DTO.jpg)
