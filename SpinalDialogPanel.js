/*
 * Copyright 2018 SpinalCom - www.spinalcom.com
 *
 * This file is part of SpinalCore.
 *
 * Please read all of the following terms and conditions
 * of the Free Software license Agreement ("Agreement")
 * carefully.
 *
 * This Agreement is a legally binding contract between
 * the Licensee (as defined below) and SpinalCom that
 * sets forth the terms and conditions that govern your
 * use of the Program. By installing and/or using the
 * Program, you agree to abide by all the terms and
 * conditions stated or referenced herein.
 *
 * If you do not agree to abide by these terms and
 * conditions, do not demonstrate your acceptance and do
 * not install or use the Program.
 * You should have received a copy of the license along
 * with this file. If not, see
 * <http://resources.spinalcom.com/licenses.pdf>.
 */

function configInit(option) {
  const cfg = {};
  if (!option.vueMountComponent) {
    throw new Error("no vue Compoment to mount in createModal");
  }

  cfg.name = option.name || "spinalDialog";
  cfg.vueMountComponent = option.vueMountComponent;
  return cfg;
}

function getDialog() {
  if (!this.dialog) {
    this.dialog = document.createElement("div");
    this.dialog.className = "spinal-modal-container";
    document.body.appendChild(this.dialog);
    this.compoment = new this.cfg.vueMountComponent({
      propsData: {
        onFinised: this.onFinised.bind(this)
      }
    }).$mount(this.dialog);
  }
  return this.dialog;
}

module.exports = function(spinalPanelManagerService, SpinalPanelApp) {
  return {
    createDialog(option) {
      let cfg = configInit(option);
      const SpinalDialog = class extends SpinalPanelApp {
        constructor() {
          super();
          this.cfg = cfg;
          this.dialog = null;
          this.compoment = null;
        }

        openPanel(opt) {
          getDialog.call(this);
          this.compoment.opened(opt);
        }
        closePanel(opt) {
          if (this.dialog !== null) {
            this.compoment.removed(opt);
            this.dialog.remove();
            this.dialog = null;
            this.compoment = null;
          }
        }

        tooglePanel(opt) {
          if (this.dialog !== null) {
            this.closePanel(opt);
          } else {
            this.openPanel(opt);
          }
        }

        /**
         * called when dialog closed by the dialog itself
         */
        onFinised(closeResult) {
          console.log("onFinished");
          this.closePanel(closeResult);
        }
      };
      let SpinalDialogInstance = new SpinalDialog();
      spinalPanelManagerService.registerPanel(cfg.name, SpinalDialogInstance);
    }
  };
};
