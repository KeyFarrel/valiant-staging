
class Store {
    private loading: boolean = false;
    private error: boolean = false;
    private timeOut: boolean = false;
    private message: string | null = null;
    private menus: any = {};
    private addAble: boolean = false;
    private editAble: boolean = false;
    private deleteAble: boolean = false;
    
    setLoading(loading: boolean) {
      this.loading = loading;
    }
  
    setErrorMessage(message: string | null) {
      this.message = message;
    }
  
    setError(error: boolean) {
      this.error = error;
    }
  
    setTimeOut(timeOut: boolean) {
      this.timeOut = timeOut;
    }
    setMessage(message: string) {
        this.message = message;
    }
    getState() {
      return {
        loading: this.loading,
        error: this.error,
        timeOut: this.timeOut,
        message: this.message,
      };
    }
    setMenus(menus: any) {
      console.log(menus);
      this.menus = menus;
    }
    getMenus() {
      return this.menus;
    }
    setAddAble(addAble: boolean) {
      this.addAble = addAble;
    }

    getAddAble() {
      return this.addAble;
    }

    setEditAble(editAble: boolean) {
      this.editAble = editAble;
    }

    getEditAble() {
      return this.editAble;
    }

    setDeleteAble(deleteAble: boolean) {
      this.deleteAble = deleteAble;
    }

    getDeleteAble() {
      return this.deleteAble;
    }
  }
  
  export const store = new Store();
  