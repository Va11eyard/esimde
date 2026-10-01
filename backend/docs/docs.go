package docs

import "github.com/swaggo/swag"

const docTemplate = `{
    "schemes": ["http", "https"],
    "swagger": "2.0",
    "info": {
        "description": "API документация для платформы когнитивного здоровья Esimde (Go Backend)",
        "title": "Esimde API Specification",
        "contact": {
            "name": "Esimde Support Team",
            "email": "esimde@galamat.com"
        },
        "version": "1.0.0"
    },
    "host": "localhost:8080",
    "basePath": "/api/v1",
    "securityDefinitions": {
        "BearerAuth": {
            "type": "apiKey",
            "name": "Authorization",
            "in": "header",
            "description": "Введите JWT токен в формате: Bearer <token>"
        }
    },
    "paths": {
        "/auth/send-otp": {
            "post": {
                "tags": ["Auth"],
                "summary": "Отправить одноразовый OTP код",
                "description": "Генерирует и отправляет OTP код на указанный номер телефона или email",
                "consumes": ["application/json"],
                "produces": ["application/json"],
                "parameters": [
                    {
                        "name": "body",
                        "in": "body",
                        "required": true,
                        "schema": {
                            "type": "object",
                            "properties": {
                                "phone": { "type": "string", "example": "+77011234567" },
                                "email": { "type": "string", "example": "user@esimde.kz" }
                            }
                        }
                    }
                ],
                "responses": {
                    "200": {
                        "description": "Успешный ответ",
                        "schema": {
                            "type": "object",
                            "properties": {
                                "message": { "type": "string", "example": "Код подтверждения отправлен" },
                                "dev_code": { "type": "string", "example": "1234" }
                            }
                        }
                    },
                    "400": { "description": "Неверный запрос" }
                }
            }
        },
        "/auth/verify-otp": {
            "post": {
                "tags": ["Auth"],
                "summary": "Подтвердить OTP код и войти",
                "description": "Проверяет OTP код. Если пользователь новый — регистрирует и возвращает JWT токен",
                "consumes": ["application/json"],
                "produces": ["application/json"],
                "parameters": [
                    {
                        "name": "body",
                        "in": "body",
                        "required": true,
                        "schema": {
                            "type": "object",
                            "required": ["code"],
                            "properties": {
                                "phone": { "type": "string", "example": "+77011234567" },
                                "email": { "type": "string", "example": "user@esimde.kz" },
                                "code": { "type": "string", "example": "1234" }
                            }
                        }
                    }
                ],
                "responses": {
                    "200": {
                        "description": "Успешная верификация",
                        "schema": {
                            "type": "object",
                            "properties": {
                                "access_token": { "type": "string", "example": "eyJhbGciOiJIUzI1Ni..." },
                                "token_type": { "type": "string", "example": "bearer" },
                                "user_id": { "type": "integer", "example": 1 },
                                "is_doctor": { "type": "boolean", "example": false },
                                "is_admin": { "type": "boolean", "example": false },
                                "profile_complete": { "type": "boolean", "example": true }
                            }
                        }
                    }
                }
            }
        },
        "/auth/login": {
            "post": {
                "tags": ["Auth"],
                "summary": "Авторизация по логину и паролю",
                "description": "Вход для врачей и администраторов по имени пользователя и паролю",
                "consumes": ["application/json"],
                "produces": ["application/json"],
                "parameters": [
                    {
                        "name": "body",
                        "in": "body",
                        "required": true,
                        "schema": {
                            "type": "object",
                            "required": ["username", "password"],
                            "properties": {
                                "username": { "type": "string", "example": "doctor_admin" },
                                "password": { "type": "string", "example": "secret123" }
                            }
                        }
                    }
                ],
                "responses": {
                    "200": { "description": "Успешная авторизация" },
                    "401": { "description": "Неверный логин или пароль" }
                }
            }
        },
        "/auth/me": {
            "get": {
                "security": [{"BearerAuth": []}],
                "tags": ["Auth"],
                "summary": "Профиль текущего пользователя",
                "description": "Возвращает полные данные авторизованного пользователя",
                "produces": ["application/json"],
                "responses": {
                    "200": {
                        "description": "Данные профиля",
                        "schema": {
                            "type": "object",
                            "properties": {
                                "id": { "type": "integer", "example": 1 },
                                "first_name": { "type": "string", "example": "Алия" },
                                "last_name": { "type": "string", "example": "Жумабаева" },
                                "email": { "type": "string", "example": "user@esimde.kz" },
                                "phone": { "type": "string", "example": "77011234567" },
                                "is_doctor": { "type": "boolean", "example": false }
                            }
                        }
                    }
                }
            }
        },
        "/users/doctors": {
            "get": {
                "tags": ["Users"],
                "summary": "Список всех врачей",
                "description": "Возвращает каталог всех специалистов и врачей платформы Esimde",
                "produces": ["application/json"],
                "responses": {
                    "200": {
                        "description": "Список врачей",
                        "schema": {
                            "type": "array",
                            "items": {
                                "type": "object",
                                "properties": {
                                    "id": { "type": "integer", "example": 1 },
                                    "full_name": { "type": "string", "example": "Др. Асан Сериков" },
                                    "position": { "type": "string", "example": "Невролог, Гериатр" },
                                    "experience_years": { "type": "integer", "example": 12 },
                                    "address": { "type": "string", "example": "Мәңгілік Ел 20/2, 4 этаж" }
                                }
                            }
                        }
                    }
                }
            }
        },
        "/users/profile": {
            "put": {
                "security": [{"BearerAuth": []}],
                "tags": ["Users"],
                "summary": "Редактировать личные медицинские данные профиля",
                "consumes": ["application/json"],
                "produces": ["application/json"],
                "parameters": [
                    {
                        "name": "body",
                        "in": "body",
                        "required": true,
                        "schema": {
                            "type": "object",
                            "properties": {
                                "first_name": { "type": "string", "example": "Алия" },
                                "last_name": { "type": "string", "example": "Жумабаева" },
                                "city": { "type": "string", "example": "Астана" },
                                "chronic_diseases": { "type": "string", "example": "Гипертония 1 ст." },
                                "medication_allergies": { "type": "string", "example": "Пенициллин" }
                            }
                        }
                    }
                ],
                "responses": {
                    "200": { "description": "Профиль обновлен" }
                }
            }
        },
        "/tests": {
            "post": {
                "tags": ["Tests (Mini-Cog)"],
                "summary": "Пройти шаг / сохранить результаты когнитивного скрининга",
                "consumes": ["application/json"],
                "produces": ["application/json"],
                "parameters": [
                    {
                        "name": "body",
                        "in": "body",
                        "required": true,
                        "schema": {
                            "type": "object",
                            "properties": {
                                "current_question": { "type": "integer", "example": 1 },
                                "answer": { "type": "string", "example": "яблоко, стол, монета" },
                                "point": { "type": "number", "example": 3.0 }
                            }
                        }
                    }
                ],
                "responses": {
                    "200": {
                        "description": "Результат збережения",
                        "schema": {
                            "type": "object",
                            "properties": {
                                "id": { "type": "integer", "example": 42 },
                                "hash": { "type": "string", "example": "a1b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d" },
                                "points": { "type": "number", "example": 3.0 },
                                "neurocognitive_score": { "type": "number", "example": 85.0 }
                            }
                        }
                    }
                }
            }
        },
        "/tests/{hash}": {
            "get": {
                "tags": ["Tests (Mini-Cog)"],
                "summary": "Получить результат скрининга по UUID хэшу",
                "produces": ["application/json"],
                "parameters": [
                    {
                        "name": "hash",
                        "in": "path",
                        "required": true,
                        "type": "string",
                        "example": "a1b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d"
                    }
                ],
                "responses": {
                    "200": { "description": "Результаты скрининга" },
                    "404": { "description": "Результат не найден" }
                }
            }
        },
        "/tests/{hash}/pdf": {
            "get": {
                "tags": ["Tests (Mini-Cog)"],
                "summary": "Скачать PDF отчет по результатам скрининга",
                "produces": ["application/pdf"],
                "parameters": [
                    {
                        "name": "hash",
                        "in": "path",
                        "required": true,
                        "type": "string",
                        "example": "a1b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d"
                    }
                ],
                "responses": {
                    "200": { "description": "Бинарный файл PDF отчета" }
                }
            }
        },
        "/schedule/availability": {
            "get": {
                "tags": ["Schedule"],
                "summary": "Свободные слоты для записи к врачам",
                "produces": ["application/json"],
                "responses": {
                    "200": { "description": "Массив слотов времени" }
                }
            },
            "post": {
                "security": [{"BearerAuth": []}],
                "tags": ["Schedule"],
                "summary": "Создать слоты приема (для врачей)",
                "consumes": ["application/json"],
                "produces": ["application/json"],
                "parameters": [
                    {
                        "name": "body",
                        "in": "body",
                        "required": true,
                        "schema": {
                            "type": "object",
                            "properties": {
                                "date": { "type": "string", "example": "2026-09-20" },
                                "start_time": { "type": "string", "example": "10:00" },
                                "end_time": { "type": "string", "example": "11:00" },
                                "type": { "type": "string", "example": "online" }
                            }
                        }
                    }
                ],
                "responses": { "200": { "description": "Слот создан" } }
            }
        },
        "/appointments": {
            "get": {
                "security": [{"BearerAuth": []}],
                "tags": ["Appointments"],
                "summary": "Список записей на прием текущего пользователя",
                "produces": ["application/json"],
                "responses": { "200": { "description": "Список приемов" } }
            },
            "post": {
                "security": [{"BearerAuth": []}],
                "tags": ["Appointments"],
                "summary": "Записаться на прием к врачу",
                "consumes": ["application/json"],
                "produces": ["application/json"],
                "parameters": [
                    {
                        "name": "body",
                        "in": "body",
                        "required": true,
                        "schema": {
                            "type": "object",
                            "properties": {
                                "slot_id": { "type": "integer", "example": 1 }
                            }
                        }
                    }
                ],
                "responses": { "200": { "description": "Запись создана" } }
            }
        },
        "/memories": {
            "get": {
                "security": [{"BearerAuth": []}],
                "tags": ["Memories Diary"],
                "summary": "Список заметок Дневника воспоминаний",
                "produces": ["application/json"],
                "responses": { "200": { "description": "Заметки памяти" } }
            },
            "post": {
                "security": [{"BearerAuth": []}],
                "tags": ["Memories Diary"],
                "summary": "Добавить запись в Дневник воспоминаний",
                "consumes": ["application/json"],
                "produces": ["application/json"],
                "parameters": [
                    {
                        "name": "body",
                        "in": "body",
                        "required": true,
                        "schema": {
                            "type": "object",
                            "properties": {
                                "title": { "type": "string", "example": "Поездка на Медео 1985 год" },
                                "description": { "type": "string", "example": "Семейный отдых в горах" },
                                "image_path": { "type": "string", "example": "/uploads/medeo.jpg" }
                            }
                        }
                    }
                ],
                "responses": { "200": { "description": "Запись добавлена" } }
            }
        },
        "/news": {
            "get": {
                "tags": ["News"],
                "summary": "Получить список новостей платформы Esimde",
                "produces": ["application/json"],
                "responses": { "200": { "description": "Массив статей новостей" } }
            }
        },
        "/voice/chat": {
            "post": {
                "tags": ["Voice AI Assistant (Sen.AI)"],
                "summary": "Чат с ИИ-ассистентом когнитивного здоровья",
                "consumes": ["application/json"],
                "produces": ["application/json"],
                "parameters": [
                    {
                        "name": "body",
                        "in": "body",
                        "required": true,
                        "schema": {
                            "type": "object",
                            "required": ["message"],
                            "properties": {
                                "message": { "type": "string", "example": "Психологқа жазылғым келеді, қайдан бастасам болады?" }
                            }
                        }
                    }
                ],
                "responses": {
                    "200": {
                        "description": "Ответ AI ассистента",
                        "schema": {
                            "type": "object",
                            "properties": {
                                "reply": { "type": "string", "example": "Бұл батыл қадам. Алдымен сені ең көп не мазалайтынын талқылайық..." }
                            }
                        }
                    }
                }
            }
        },
        "/payments/create": {
            "post": {
                "security": [{"BearerAuth": []}],
                "tags": ["Payments (PayLink)"],
                "summary": "Создать ссылку на оплату консультации",
                "consumes": ["application/json"],
                "produces": ["application/json"],
                "parameters": [
                    {
                        "name": "body",
                        "in": "body",
                        "required": true,
                        "schema": {
                            "type": "object",
                            "properties": {
                                "appointment_id": { "type": "integer", "example": 10 }
                            }
                        }
                    }
                ],
                "responses": {
                    "200": {
                        "description": "Платежная ссылка PayLink",
                        "schema": {
                            "type": "object",
                            "properties": {
                                "id": { "type": "integer", "example": 1 },
                                "paylink_payment_url": { "type": "string", "example": "https://paylink.kz/pay/demo_esimde_checkout" },
                                "amount": { "type": "integer", "example": 1500000 },
                                "status": { "type": "string", "example": "pending" }
                            }
                        }
                    }
                }
            }
        },
        "/admin/audit-logs": {
            "get": {
                "security": [{"BearerAuth": []}],
                "tags": ["Admin Audit"],
                "summary": "Журнал аудита действий пользователей (только для Админа)",
                "produces": ["application/json"],
                "responses": { "200": { "description": "Массив записей логов" } }
            }
        }
    }
}`

type s struct{}

func (s *s) ReadDoc() string {
	return docTemplate
}

func init() {
	swag.Register(swag.Name, &s{})
}
