export namespace telegram {
	
	export class AvatarResponse {
	    type: string;
	    b64: string;
	
	    static createFrom(source: any = {}) {
	        return new AvatarResponse(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.type = source["type"];
	        this.b64 = source["b64"];
	    }
	}
	export class GetNameResponse {
	    name: string;
	    error: string;
	
	    static createFrom(source: any = {}) {
	        return new GetNameResponse(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.name = source["name"];
	        this.error = source["error"];
	    }
	}
	export class GetQrCodeResponse {
	    qr_code: string;
	    error: string;
	
	    static createFrom(source: any = {}) {
	        return new GetQrCodeResponse(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.qr_code = source["qr_code"];
	        this.error = source["error"];
	    }
	}
	export class ProfileResponse {
	    first_name: string;
	    last_name: string;
	    avatar?: AvatarResponse;
	    error: string;
	
	    static createFrom(source: any = {}) {
	        return new ProfileResponse(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.first_name = source["first_name"];
	        this.last_name = source["last_name"];
	        this.avatar = this.convertValues(source["avatar"], AvatarResponse);
	        this.error = source["error"];
	    }
	
		convertValues(a: any, classs: any, asMap: boolean = false): any {
		    if (!a) {
		        return a;
		    }
		    if (a.slice && a.map) {
		        return (a as any[]).map(elem => this.convertValues(elem, classs));
		    } else if ("object" === typeof a) {
		        if (asMap) {
		            for (const key of Object.keys(a)) {
		                a[key] = new classs(a[key]);
		            }
		            return a;
		        }
		        return new classs(a);
		    }
		    return a;
		}
	}

}

