import {HttpParams} from '@angular/common/http';

export function p_add(
  params: HttpParams,
  name: string,
  newParams: (string | number | boolean)[] | undefined | null | string | number | boolean,
): HttpParams {
  if (newParams !== undefined && newParams !== null) {
    if (Array.isArray(newParams)) {
      if (newParams.length > 0) {
        for (const param of newParams) {
          params = params.append(name, param);
        }
      }
    } else {
      params = params.append(name, newParams);
    }
  }
  return params;
}
