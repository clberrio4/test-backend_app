import { createConnection } from 'typeorm';
export class Database {
  public static connect(): any {
    createConnection()
      .then((cnn) => cnn)
      .catch((err) => {
        console.error(err.message);
        return err;
      });
  }
}
