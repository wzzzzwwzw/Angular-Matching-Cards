import {HttpService} from "./http.service";
import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {PersistenceService} from "./persistence.service";


@Injectable({
  providedIn: 'root',
})
export class ApiService extends HttpService {
  PATH: string = "http://fenw.etsisi.upm.es:10000/"

  constructor(
    http: HttpClient,
    persistence: PersistenceService,
  ) {
    super(http, persistence);
  }


  async login(username: string, password: string): Promise<boolean> {
    let route = this.PATH + 'users/login';
    this.persistence.setToken(null);

    return new Promise((resolve) => {
      this.getRequest(route, {username: username, password: password}, false).then(res => {
        this.persistence.setToken(res.headers.get('authorization'))
        this.persistence.setUsername(username);
        resolve(true);

      }).catch(err => {
        console.log('ERROR' + err)
        resolve(false);

      })
    })
  }

  async createUser(username: string, email: string, password: string): Promise<boolean> {
    let route = this.PATH + 'users';

    return new Promise((resolve) => {
      this.postRequest(route, {username: username, email: email, password: password}, false).then(_ => {
        resolve(true);

      }).catch(err => {
        console.log('ERROR' + err)
        resolve(false);

      })
    })
  }

  async usernameExists(username: string): Promise<boolean> {
    let route = this.PATH + 'users/' + username;

    return new Promise((resolve, reject) => {
      this.getRequest(route, null, false).then(_ => {
        resolve(true);
      }).catch(err => {
        if (err.error !== "username not found") {
          console.log(err);
        }
        resolve(false);
      })
    })
  }


}
