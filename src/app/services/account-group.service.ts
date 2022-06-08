import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs';

import { environment } from 'src/environments/environment';

import { AccountGroupCodesDto } from 'src/app/models/dtos/account-group-codes-dto';
import { AccountGroupDto } from 'src/app/models/dtos/account-group-dto';
import { ListDataResult } from 'src/app/models/results/list-data-result';

@Injectable({
  providedIn: 'root'
})
export class AccountGroupService {

  private controllerUrl: string = "accountgroups";

  constructor(
    private http: HttpClient,
  ) {}

  // API İstekleri
  getAll(): Observable<ListDataResult<AccountGroupDto>> {
    return this.http.get<ListDataResult<AccountGroupDto>>(`${environment.apiUrl}/${this.controllerUrl}`);
  }

  getByAccountGroupCodes(accountGroupCodesDto: AccountGroupCodesDto): Observable<ListDataResult<AccountGroupDto>> {
    return this.http.post<ListDataResult<AccountGroupDto>>(`${environment.apiUrl}/${this.controllerUrl}/getbyaccountgroupcodes`, accountGroupCodesDto);
  }
}
