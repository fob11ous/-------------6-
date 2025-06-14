type TLetters =
    | 'A'
    | 'B'
    | 'E'
    | 'K'
    | 'K'
    | 'H'
    | 'O'
    | 'P'
    | 'C'
    | 'T'
    | 'Y'
    | 'X';

type TNumbers = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 0;

type TPhoneBrand =
    | 'Apple'
    | 'Samsung'
    | 'Xiaomi'
    | 'Honor';

type TApple = 'iPhone X' | 'iPhone 16' | 'iPhone 16 pro';
type TSamsung = 'Galaxy A53' | 'Galaxy A52' | 'Galaxy A51';
type TXiaomi = 'Redmi Note 60' | 'POCO X3 PRO' | 'POCO X3';
type THonor = 'Honor 7' | 'Honor 8' | 'Honor Magic';

type TPhoneModels = {
    Apple: TApple;
    Samsung: TSamsung;
    Xiaomi: TXiaomi;
    Honor: THonor;
};

type TModel<T extends TPhoneBrand> = TPhoneModels[T];

interface IPhone<T extends TPhoneBrand> {
    id: string;
    brand: TPhoneBrand;
    model: TModel<T>;
    seriesNumber: string;
    createdAt: Date;
    deletedAt: Date | null;
}

interface ICreate<T extends TPhoneBrand>
    extends Omit<IPhone<T>, 'id' | 'createdAt' | 'updatedAt'> {}

interface IUpdate<T extends TPhoneBrand> extends Partial<ICreate<T>> {}

interface IResponse<T extends TPhoneBrand> extends Omit<IPhone<T>, 'id'> {
    status: number;
    isSuccess: boolean;
}

interface IPhoneService<T extends TPhoneBrand> {
    create(data: ICreate<T>): IPhone<T>;
    getAll(): Array<IPhone<T>>;
    findById(id: IPhone<T>['id']): IPhone<T> | null;
    update(id: IPhone<T>['id'], data: IUpdate<T>): IResponse<T>;
    delete(id: IPhone<T>['id']): boolean;
}

class PhoneService<T extends TPhoneBrand> implements IPhoneService<T> {
    private phones: IPhone<T>[] = [];

    public create(data: ICreate<T>): IPhone<T> {
        const newPhone: IPhone<T> = {
            ...data,
            id: this.generateId(),
            createdAt: new Date(),
            deletedAt: null,
        };
        this.phones.push(newPhone);
        return newPhone;
    }

    getAll(): IPhone<T>[] {
        return this.phones.filter(phone => !phone.deletedAt);
    }

    public findById(id: IPhone<T>['id']): IPhone<T> | null {
        return this.phones.find(phone => phone.id === id) || null;
    }

    public update(id: IPhone<T>['id'], data: IUpdate<T>): IResponse<T> {
        const index = this.phones.findIndex(phone => phone.id === id);
        if (index === -1) throw new Error('Phone not found');

        const updatedPhone = { ...this.phones[index], ...data };
        this.phones[index] = updatedPhone;

        const { id: _, ...response } = updatedPhone;
        return response as IResponse<T>;
    }

    public delete(id: IPhone<T>['id']): boolean {
        const index = this.phones.findIndex(phone => phone.id === id);
        if (index === -1) return false;

        this.phones[index].deletedAt = new Date();
        return true;
    }

    private generateId(): string {
        return Math.random().toString(36).substring(2, 15);
    }
}

const phoneService = new PhoneService();

const createPhone = (data: ICreate<TPhoneBrand>) => phoneService.create(data);
const getAllPhones = () => phoneService.getAll();
const findPhoneById = <T extends TPhoneBrand>(id: IPhone<T>['id']) =>
    phoneService.findById(id);
const updatePhone = <T extends TPhoneBrand>(id: string, data: IUpdate<T>) =>
    phoneService.update(id, data);
const deletePhone = <T extends TPhoneBrand>(id: IPhone<T>['id']) =>
    phoneService.delete(id);

const phone1: IPhone<'Apple'> = {
    id: 'kjdfbaskjdbasjdakjbadsjf',
    brand: 'Apple',
    model: 'iPhone X',
    seriesNumber: 'AK123BX 456',
    createdAt: new Date(),
    deletedAt: null,
};

createPhone(phone1);