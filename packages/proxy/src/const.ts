/**
 * File: const.ts
 * Description: 实用常量
 * Created: 2021-08-10 23:40:48
 * Author: yuzhanglong
 * Email: yuzl1123@163.com
 */
import * as path from 'path';

export const LOCAL_HOST = '127.0.0.1';

// 代理服务的端口
export const PROXY_SERVER_PORT = 8087;

// 负责转发服务的端口
export const PROXY_PASS_SERVICE_PORT = 8089;

export const pathCert = path.resolve(__dirname, '../certificate', 'rootCA.pem');

export const pathCertKey = path.resolve(__dirname, '../certificate', 'rootCA-key.pem');

export const MAX_DAYS = 365;

export const CERT = `-----BEGIN CERTIFICATE-----
MIICtDCCAZwCCQD3RjTCqFnNCzANBgkqhkiG9w0BAQsFADAcMRowGAYDVQQDDBFh
dHRhY2htZW50cy1wcm94eTAeFw0yMTEwMTcxNzEzNDFaFw0yMjA4MTMxNzEzNDFa
MBwxGjAYBgNVBAMMEWF0dGFjaG1lbnRzLXByb3h5MIIBIjANBgkqhkiG9w0BAQEF
AAOCAQ8AMIIBCgKCAQEA4dfYE44Mnt1yo2wH7rlJH5/psezwNB6uOLSMqzNsiH/4
qvsFPmhj3RMo1X3gKhueV4SazBNV7KfgEy4qbEnyT7qfdZDvNSM0VoE6Wy8zwvC/
mj1wHnVMceGJHlv8Mjd/SeQH2m0Uo4Or3HGUD3hHPo6TzNxwNct+0tFNjktNMLhe
5SzJ1VvptsqQnOOn7AJAqLFYYxGkzCfPzEM4mL3oeUThooZfxDunjtDyo57Bkdin
GRn+glckD+K0YCrX2rQdOryqJACBIwZaRD/vB7oE4EqY1pY073sVgsQpvP0/cl3d
tt0zJKJ/pKZLFuTg0ts8XwrmmlSI2by9Cxium88/0QIDAQABMA0GCSqGSIb3DQEB
CwUAA4IBAQDXM1rlEw2eZIDDBD2dW7U3dzbWAnh0542O8XRnCfI0E+gWAn7xxuJj
lGQQj54PeBrK65JV8KRke8sOl3RJcWfy8L1okIhYr1StreECRPGpAftMeK0RAyLt
0HWW8FUnrNWPIgOjWyacAERTgc2uzNGXOba83qem6CC0ICSFo+ZhqQPoet1++x9b
D4L9ayfnhRh2/ePbtjZycgHBhNtFE2qn9NSh2pJ7Q1IWi0HPwgK1r39b5Mv10D2Z
6/j+9NILmMZv0Xp+0x1eD+Wd8pl7xcb41RhkRUqqaaY5crsZaRFm+KE+mxVAHDtW
/cRwZuekdudKiYqimIha5HdfGEwbK6AY
-----END CERTIFICATE-----`;

export const KEY = `-----BEGIN RSA PRIVATE KEY-----
MIIEpQIBAAKCAQEA4dfYE44Mnt1yo2wH7rlJH5/psezwNB6uOLSMqzNsiH/4qvsF
Pmhj3RMo1X3gKhueV4SazBNV7KfgEy4qbEnyT7qfdZDvNSM0VoE6Wy8zwvC/mj1w
HnVMceGJHlv8Mjd/SeQH2m0Uo4Or3HGUD3hHPo6TzNxwNct+0tFNjktNMLhe5SzJ
1VvptsqQnOOn7AJAqLFYYxGkzCfPzEM4mL3oeUThooZfxDunjtDyo57BkdinGRn+
glckD+K0YCrX2rQdOryqJACBIwZaRD/vB7oE4EqY1pY073sVgsQpvP0/cl3dtt0z
JKJ/pKZLFuTg0ts8XwrmmlSI2by9Cxium88/0QIDAQABAoIBAQDeKatISUNHAAam
lj4TazdwoamNOsxsKQYviASc4UBR4rlm0PoukxgxwIg5w9LA+VxBMZPpTtgGrnmx
xIc88V0payczyrhVaGUy93rFemCL0rJY8zkY7UCfAkMVl102tPtFX8kN6KIV3BAz
EZOZyDMlabIhI3RKpv0CO5z0bkTnt4zWTma1BQjGndu/M1wdSjiVgDfKGlrPs4pn
EueeLcH43DrYXv1V9akuDMkHnl5F/V2WfSYlA3NpGA/WfdTKTbOx1g7A4zpEBSju
uMlOBHqL57WxdFFJBnt8ibf2ZM8hN4XOjaZBEhCFDnmZJkqtwk/QkZUA2nlYdGlG
hQEm6yRBAoGBAP8Jq8rGyWvw0GzNIrqPhPxh+KOkLTSzMWhZR+0301f/E8dXFZpQ
1ybapSwrWn+IzQ9a4U0GvpHNGwjrGF+NgmQXOpqHtJDImlMRMmekQqmr14bIUERD
us+B6X9naIgBigRt6N/qOGkkU72CEchNL17WvhjRshwUuoZ1UjM15rI5AoGBAOKx
+ar/zS+dkROL5wTPk5yI2463D6dOAiVIl03ueTHN+yGjcr/9r+nfzq9krjnQa/LF
xnClMVmdIcgb8EuUqh3wGQhDu9SPVSHRHJgnis+6vISVdWCmIRL0DyGCLthR1wqR
SVjJ3q/kiDqlh9YDafdKyQPr17GX75hA7ItejZpZAoGBANSpw856pEqVq7aN93+J
XWL2btZFeEyRf4l7qTZtbpXZ5Sw7uY/MCRwlBcYnAHeIIzXCmkwYa6A4X2q4XsKO
xUOg+wUQU8jG/ah2lolFtzC0UivZrNS/hW6y7XmHSOrgHa5D2AOe0xsZZ5qGcz2K
3w0+E5Wuhc5UmpS0D68UKyJBAoGANbZFmaaSTz3eKet0CUfFiclDfEUTiGiLSZox
f12JiatsXUQE5EiPbbKBnj0Uqs4fRZ5mrjn1v23jmy5DeST4Sa+hvruNvYdYfHK3
e7WixiVQlXl0Hjo+i+cXzrCxuL9rXC2gW1E5WiOjw4GE9chJSzaE+lDfAk0lj8WS
RlNY6cECgYEAitybPUumZgxqH7AZtQosHg6caqYVDo8sN8RRsEc5GkTLRBTJaKMT
UyhX72TclGN0DrsyBTb07rrguSkGOT1lJyrM0MKhTifrp63k0FfQcOi97J0OX8rP
JZr0ms06n/WCuIobId8uInOZ+QE7ZVa7gMqq1RI4w0jHtBpLsnC8YRw=
-----END RSA PRIVATE KEY-----`;
