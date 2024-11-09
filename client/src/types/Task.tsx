type StatusType = 'поиск исполнителя' | 'в разработке' | 'на утверждении заказчика' | 'доработка' | 'завершён' | 'в поиске';

type Task = {
    id: number;
    title: string;
    description: string;
    status: StatusType;
    created_at: string;
    deadline: string;
    accepted_at: string;
    budget: number;
    executor_price: number;
    executor_name: string;
    executor_url: string;
    customer_name: string;
    customer_url: string;
    file_id: string;
}


export type {Task, StatusType}