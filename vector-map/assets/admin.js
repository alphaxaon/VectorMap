(function($){
	class Map {
		/**
		* The constructor for a new map.
		*/
		constructor() {
			this.drawingManager = null;
			this.selectedShape = null;
			this.shapes = {};
			this.metaFields = {
        		name: '',
        		address1: '',
        		address2: '',
        		citystatezip: '',
        		phone: '',
        		fax: '',
        		email: '',
        		website: '',
        		lat: 0,
        		lon: 0,
        		color: null,
        	};
			this.colors = ['#5c5c5c', '#616161', '#727272', '#939393', '#a3a3a3', '#bfbfbf', '#d7d7d7'];
    		this.colorButtons = {};
    		this.selectedColor;
    		this.mapdata = mapdata;
    		this.listenForCoords = false;
    		this.marker = null;
		}

		/**
		* New shape is drawn.
		*/
		shapeDrawn(e) {
			this.drawingManager.setDrawingMode(null);
			this.addShape(e);
		}

		/**
		* Add a new shape.
		*/
		addShape(e) {
			let shape = e.overlay;
			let that = this;
        	shape.type = e.type;
        	shape.id = new Date().getTime()+'_'+Math.floor(Math.random()*1000);
        	shape.meta = this.setupMeta();
        	shape.meta.color = this.colors[0];

        	this.shapes[shape.id] = shape;

			google.maps.event.addListener(shape, 'click', function(e) {
				that.setSelection(this);

				// Set coordinates
				if (that.listenForCoords) {
					that.setLatLon(e);
					return;
				}

				// Delete vertices of a shape
				if (e.vertex !== undefined) {
					if (this.type === google.maps.drawing.OverlayType.POLYGON) {
						let path = this.getPaths().getAt(e.path);
						path.removeAt(e.vertex);
						if (path.length < 3) {
							that.deleteSelected();
						}
					}
				}
			});

        	this.setSelection(shape);
		}

		/**
		* Load a shape from existing data.
		*/
		loadShape(data) {
			let that = this;
			let metadata = JSON.parse(data.meta);
			let polygonOptions = this.drawingManager.get('polygonOptions');
			polygonOptions.fillColor = metadata.color;
			polygonOptions.draggable = false;
			polygonOptions.editable = false;

			// Create a new shape
			let shape = new google.maps.Polygon(polygonOptions);
			shape.type = data.type;
			shape.id = data.shape_id;
        	shape.meta = this.setupMeta(metadata);

        	// Set the path
        	let decodedPath = google.maps.geometry.encoding.decodePath(data.path.replace(/\\\\/g, '\\'));
        	shape.setPath(decodedPath);

        	// Add shape to map
        	this.shapes[shape.id] = shape;
			shape.setMap(this.drawingManager.map);
        	shape.set('strokeWeight', 0);

			// Add listeners
			google.maps.event.addListener(shape, 'click', function(e) {
				that.setSelection(this);

				// Set coordinates
				if (that.listenForCoords) {
					that.setLatLon(e);
					return;
				}

				// Delete vertices of a shape
				if (e.vertex !== undefined) {
					if (this.type === google.maps.drawing.OverlayType.POLYGON) {
						let path = this.getPaths().getAt(e.path);
						path.removeAt(e.vertex);
						if (path.length < 3) {
							that.deleteSelected();
						}
					}
				}
			});
		}

		/**
		* Load a shape from a template.
		*/
		loadTemplateShape(state) {
			if (!this.selectedShape)
				return;

			let newShape = null;

			if (state == 'Alaska') newShape = '{ojjLbav{YsqTvkiCk}}@~}yQovx@nifUoyGfznO{gdAnk|GbqDbfkGg~{@zxlDcaQnwkJnqn@~xgFztI~jhIv}qBvtsL~xjBfvmIjswCv_cIviWru~HvxcDvmbFn}}B{e~KjkkAsi~F~mcBc{rBzse@v_rIjnx@vecJvvq@bvrGznfB_oFvzwAgp~Gf|}BwbyA~w`Ak~xFr`FsfhNfhJkxxEfnt@vvaHzyl@~mxIbajEvgbEjlsC~cwBfyzCweiBjn}@~noGzz_EktWjuYojtJzdGw}iF~jp@wbsIj~aE{c|@wkBwerJf~S{a}EbclAsavBvolCzkdEnzcBj|pC~|]~hoFvsbBzquEf_|AnxsGbh{AvdrDfzyBzv|Ij{pBrr_HvrqAvsbGveiB{f}@c`|@oekGg{}Fcig`@kwyAgscUc`~DgbnUk|iIgbhS{elJcw`GwcjBw_rSgxpB{j|Gn|xAgpdJrpMcabNzpx@kgcFbj_B_wbIn|zEw`fKzz_EsjwCfnsC{ntEvmaDsd}D~teCkafAgoNc_lQw~nB{szB_vgCfnBoeVj`RcfaBnc`HwqoFnizF_hlDny{D_|pBf}oE_}~AzllBbue@riiDniuAvz|Aw`On{wCcgdD~gxHses@caVbk`@vaqDshVjeaE_`hz@v_C';
			if (state == 'Alabama') newShape = 'svstEzthyOzkAkrxNfecL_fsAznpBcgv@ftSjsZnaeA~yRzst@_~P~mb@vwFzeXfqCvlg@w~Tvj@ra|NfjI{r@ngPfmEf`b@_ti@bvl@_oFbmx@~h]{r@~lgDsurIjdPk|hQgugAcqIntLngFoaD';
			if (state == 'Arkansas') newShape = 'suphE~n~|Pv|Ak{hPsqToi@oqKooQc_Wv{DwrUj|DwmAr`KgySbbDczLkeMkoMjeM{w@ktWshQj}AjqBswQogKwcAk|SfeIsxNkk^_tKohCspHvvIgmEwzGjwDkiK{dQ~aOkdUwtm@{xQo_Y{iQka@{|JnhCwnW{bHs`FzOwpVwgNvjEszRorCgaKcq]rwB{pPcbDshBk|Sw|Ko{KslOn`Gcl]_wBojVw~TstUgiG{tIspCgwc@stx@spHrsD{|EjyCja@b_`CwqXk|Skk^gx`@szR_wB_sDr_Ns}Nja@zE~ufZrmyEg{a@zmtIrkHk_A{fF~aOgeIwqDg`]zEsgJjhIwn\\jcSja@bboA?';
			if (state == 'Arizona') newShape = 'sly`Fb~fnT{Ek`rI?{qaJj_ra@nP?jyiKgwaF~ryUszC{O{pKka@{dGo_@wzGwbIcxMo~GzfAwjO_q@c~EgdBgiGkkJgyD{oDkxFsyKrjAgkKwG_gJbzGfc@vjOgc@vsH{mJn|HstUkyCcgNzfFotLkyCszHbqDcj@cdM_oPcrKc{DssDciRo`G_kHvcAsxDc~EwgI~z@ouI~yCoqFrXomMja@cxCsyAkcIkoHg{C_rG_qJja@gbHcjO{aFgaKoiEcwKkwIgcJjM_oFsaH~z@{fKjdPoxEb~EgeIzvMovFnhCgaFz}B{_Lv`JonJ~vBkvQ~eMg_LvvI_xIvsHw}MoPosOvVcfLn}@wdCcbD{lHo|H_e_@v{DwhUzzKg{WvcAksFw_Cc~EzfFcgIvcAcnRrg@chK{qHcrU~aOkrSvcAspCwnM{yD{bHfkAkl[_yAwaVzsLovK~xAvrAjqGsaMktCcxRsgJ_sDgkAnlAsv@ohCkrNkpJse_@cG{g{Bfc@';
			if (state == 'California') newShape = 'kxi_Gr`hvVsXoxvCw~@k_{Az^cu~EreA_nuCcL{|pFfehQja@fpyGwsnKrrhFoauHj`gG{nqI~bGvG~wI_{@byE~z@~|Do`Gn_J_sDbcKg}LbcK{bHzh@~z@~{L{jDfkKkmIfkKfr@b~@o|HbmAgmEjzEc~EraHgyNv}HskH~oHoi@gT~pEjwIvtJfpAoPfxBjlL~zErlEvpBroFni@zbHvbDfjDniJ{OjbBndEjmIzbHfjDjyCf{C{jDbuGbfBbcFsXzuKcfBf`IwcAz{C~uEbdHgYncHj}AjdFk}ArfC~uEruC~vBnvKzbHnkDbbDj_AbvIbsHgr@rzHrlEjqB_{@~_AwwFnjBwcAzfAv_CzqMwcA~|NrsDv[cfBfjIssDckBgnBnyBcfBjMwwFcj@guAjM_gJf|JcbDw[guA~sFbj@rmQcfBfeDn`GjaEnhCblD{Ovj@b~Ev|ArdIknA~aOrsDfqCzhEng{Azba@z}aLcat@n{Zk_s@fpU_}b@bjOcuj@rwhAsbOzhnBcip@jhNwh_@rp`Ckwl@~{zBolKf}iCktu@nje@cvtAcuLwom@frw@o_|@j_d@osuArr|Ac{{@r`bAobvAzjDkz_BvqcBookB~tf@waVzzbAoqvA~aOwrlA~hcB{gp@jl[wj|@~mIg}wAvsHcpmAzuvA{ny@ziVoniBcv`Aomk@zjD_m|Av~Tc}u@_nI';
			if (state == 'Colorado') newShape = 'osy`F~xpxSja@_tvi@sjmWvcAfEzhui@~alWsX';
			if (state == 'Connecticut') newShape = 'gzs_Gz_p_McGogKnvAcdvBnqFnPce@_nIodE{m@_DgaKzc@{wO~W{O?{jDsq@ka@?kg`@v~@g_uB~uaAwcAzas@vcAriDb~EzaKrrBoUn`Gv_CnbFnyBbmPrsD~iK~xKjgcA~kTb`nBz|Jvpo@fqMjafAsgEfgHo|HbhAscLbvIwhUwrn@_sNrcLsce@gnB{blBwzG';
			if (state == 'Delaware') newShape = 'oqlqFjbrmMfse@gr@ruvBcvIf||@ohCjrXolAvhA_yaDonpAgr@z}Bfse@ghh@v|U_he@vl]seUvyY_ePvdRwcFwGcvNo~G{cJjqGwqb@os^kxAzvMk\\rza@rlTb|Z';
			if (state == 'Florida') newShape = 'ome|DfjuuO~MczjEkk@odhEjM_noA{EcaVzzKcfBjcI_kHnoG_{@z{HwGbaGwcA~tH_nIfr@{vsAfzFsv`Dv~Jo`jEbdCcrbAjdF?~}ZstAbqDczG?guPk~Wo`Gk}ZjyCswGrXg|EstAoaDrtA{~Do`GorCnhC{r@cyJkyCccAntB{}LvwAsdIvhAo`GnaD_uWjyCcrK{TsoFjz@{fF_NkqGvwAkyCjM_rG~Mk_d@jbt@zr@rcV_jKblhBghY~{qDwfwA~yiA{dj@rlw@bfBbcdE_axAnu`AssSjihC~}PjsyBjdPrhzBfqiAfwaArn~AryZf~lEsnI~~u@ohRj|Sgg\\ogUgecBos{C{hkAbrK_y}@fl}AobqAnxaA{omBjnn@sjqAzgz@g_rA~|b@swy@cfBo{jBcu[kheAno`@cgNf{a@kzfAny~@_e`Br{uAz}BrnXvze@rd`Abtm@~guB{uFrl|@ofl@b|i@orsAz{vBcjJne_CneLbbaC{l\\wnMglWkgLweJkCodOneBwkLr{@{dGrtA{iQ~uTsbOzqRklQ_vEocC?goDfuA';
			if (state == 'Georgia') newShape = 'wlrtEfjoiOni@_ekDzEw`nBc~@o|kEbzLfmEr|Qjk^bgSjmI~{L_kHrbO_i]rtP_m[vaBgpUvsCslErpa@{mTnvZ{zKfwTkdPbd\\oje@ndT{}[n}O_sDnhM{zKjbQw~Tr}XooQvy^caVzzFo|HfgC{fFjfJghYvvNokSryKja@~{o@{nQzmTka@nkIwvXzxL_bOjdZk|DfeSw_Cj~Rw{DzuKchd@kMsfk@zr^rlE~upA~km@b~zAfhYzpx@b}W_|Bj}gA_fHf|^o|Hr}b@b|KbnMbaVnhCrp\\ohCb{InlAviMjyCkMj`RcbD~qGkeRzkA_lOvGswGv~qCwwPjcqJwlNfaKwbXrlE_eKjxFcb]brKghO~qG{c|@sgJk{t@r{Og~]kqGgse@sgJgdQkwXgx[byJwd\\f}Ls|[zzKcfVzzKkb`@n`GkmaCfhYo{pDblb@cdsAbjO';
			if (state == 'Hawaii') newShape = 'wtbvBnzwn\\_~gAjbe@{ux@nbi@cgg@rrkB_{zAfse@wql@~ukAsvr@ro{AknUzqxAk~MrknAcx_Azkx@g}wAfipGnF~`gBrvc@fmkAnnr@nyo@~hv@scL{lWws_A~uEofmBjcrBkjsFbjw@{vjCbjYg_o@zhaAw{jAbiHcgv@~cXwzmAjrl@j`Rfr}BswQrox@ohCbiu@o|nAsw`@kibA{z}@gl}Awv{@_dq@';
			if (state == 'Iowa') newShape = '_vuvFjqngQjf@gdpL_vEs~_J~kJoxJvy@geIbvb@svc@kyRwnMcoOvwFsh[sqw@_~U_{@kuT_qY_jn@bzGo|MrwQcm_@kiK{sGcv`Ao`Lcxk@ggMwyYcg]kiK{xLg}L{wO_nI{zd@v_CkjHnoQ_r[vj^oeV~|So}TvbSkiUjeMosJnwMowMfwr@_kMzfFgkKvsHky\\j}AwgN{O{b\\k`R_rGvn\\g~NznBo}Obj@fEnew_@noBrtAznQs{Oj__@~rDzdQ_vTfeg@ftSjcg@vcPvbSopNjpTg}L~{GosOneQja@rmQoxJjbLznBnkg@srVvdHokSzcc@kiKzfZjyCfi`@ko\\v_a@scLrmo@k}A~{e@_sDzt]~z@fiQ{rO';
			if (state == 'Idaho') newShape = '_iajHjxhiUgJs`_EfogEsXzzlAg}cAvlDzzK~jWbLfaUczj@jyH{hh@v_Mc~EfwEsoFvlb@ofg@zoSswQny[kk^rfCodEzzK{u_@?ocWcwAkpYz~Xj}AbyJfbHfjS~yCvvNzbHjl[vsHfrr@klLzmOncWbnRshGn}TrhGvpBohRvjO{eX{|OwfQ{dB{mTgqWg|^zjNsnXba`@shGr~_@cmPn`o@cgv@juOvnMvs\\{`]klBohR~{L{eXjbo@wfQjhX_aa@k|I_wB_kMokSjnFcv`A{mOkiKjnAkzh@gaFkok@fxGsgJ_dDgyeAgtNn`GwjTcyYbnp@sl|@~yvBoi@fnjJ?z^~qyEzw@z_gIkk@nje@kk@~iwC~W~}sEzEvbvE{^nlAkxzIbGw}H~\\w{DkwDsrGw}C{zUggHkyCrmG{eIc|F{tIsoFo{Fr_NciH~z@oZriIvpBfsBsnDffFciCzlC~eCzdGknFf}L_fHcbD_eFfkFotQk_AsaHsmGwwAgkFk~f@_zRgvHw~TksK_qEokNcwKofDfsB_iDrXscGstAkxKwtJ{zKwoJkwIolA{eSobF{`NozIswGw{DczBgmEcnM{gCs_NwpLo|Mf}LooG?s|B~tCw{Dz{Mve@_tF_N~iKwzGn|Hn}@rkHwpBfhEc{DfuA{_GbvIorH~xA_kCfsBswGrjFg}L~mIczGwsHwtEon@_nDfkFojGka@{wErlEgfFrsDwvDv{D_bOk_AcedBwGsgpK{m@';
			if (state == 'Illinois') newShape = 'o`nbGf~chP~vBcs_UzfmCvec@vQju|@f}|KvcAztv@oPnqi@rrVb|d@_qYj_i@wcAz_VzmTzzUvwFnoVncWngPjpJfsGzaZ~vQ{bHfp_@vfQ~iPrpCz{RstAn|\\~qVnmW_~PnoQjedArxXvfQ~iZs{OzmOr_N{mOfgk@otLb|i@rbJncWjbVrwQflHj{V{m^z}[spWbiRgbWwbSolx@zjSkhv@~esAoav@~moAw}dAwrZolZ_jKgdLsgJkuJ~iKghOrys@f`SrjZkea@baV_`d@nhC_`PnkS_hLnhRgi`@nfg@kg`@nbi@opXnsOgwYjmIgga@znB{eb@czGcaL_fM_jZfr@{sLsf\\gsLcyYcxWcbD_bTgmTgol@ffFs|LbmPkmb@klL_sDsvc@rXocWkiZk}gAs`d@kdPwqX{mToab@nhCgnV~|b@{zPbqN_lTrwQ{yN~qV';
			if (state == 'Indiana') newShape = '{m{}FbxeuO?{oqOvbgObcA~vG~eMr_]w{DnjLc~EjeH{kA_g@npN~z@~}PneQ~xd@sgEjfr@rd]slE~gVj_d@vna@nw\\soAnwMf_GvcAjg[zzKjjMbfBvmKb}Wo|HzbHohHrza@c~Efr@{_Ggr@_uHj`RfzZz}[j{VjlLjmNjmI{iLbj@?vwF_kM~pYb~EjhNj{GbyYbeTfqRoa]zgz@ouD~l[zjIvwFzjI~iKwqInje@vs\\bnM_~AbuLwiCja@rq@zeD{xBfoDsIggHoaDnlAw{Ib|FgeD{jDw}C_qEobAkyCsmGrtAgoDvaBgzAo`G_pCwwFwsCnzIsbEczG_rBgiGcsCj_Ac_CjuEg_Gzr@{`D_tFk}As}NwgDw{Do~B~\\woEcdC_|BwwFcyEkwDsdSomRkaEzjDspHgaKcVrtAgmO{pP_|GofDo`Gk_AkwIvyE_nNk}AwhFfr@{yDnP_cB~jHgeSzbH_cBrsD{yDfr@gmEspCwqN{bHkoR{~IozuM{r@';
			if (state == 'Kansas') newShape = 'gddsFfwzmR??z_kQoi@ka@{vhl@crnJcfBgxe@r{@waVrXfyDj|SweTf`]cvv@b|i@ks_@ksi@{qRzkAsnIn`Go{AnwMzbC~aOckLzeXgpKjaOjf@vwdh@';
			if (state == 'Kentucky') newShape = 'gsw}EnvnaP_v@gcm@fh@{{vBbo@kbzBoma@nlA~zEcci@vo@sqzFvqDkzzPseP_tx@wyJw}f@_zk@omu@od|@clhB_zf@oiw@kq`@blb@cke@j_d@geXrsSwoc@jwXkve@_rGcxWbx\\{oNnlP{b\\vrKrsDbaVbjOvzVn~BrjZ{sQ~go@voJ~mX_eUjrl@wdCvn\\gdG~`a@sfa@nkSchUr~_@giB~pY__Db}Wn{P~pYnrW{nBrvYoxJz}Bftb@rbOnje@kuEvpo@nk]gmE~gVj_d@rm`@z}[~R~iKjsKz~Ijya@rcL~jMzmTslJvkLo|H~d_@gqMvG{gH~}Pnk]rb^~pTjpJbgNbvIgaKnlAkaOjg`@r_Nnbi@~sUj`Rc_\\zlu@cjEf_`@nmRj|SgbHrre@vk[vrKwwAzvM~xZb}Wv~Y_~P~sPntcAroZfuPnnYwjOfnLzyN{bMfcm@okNb`h@zmOfd[~_UzrOvlNkhNf{WbuLztN~vBfkUfr@~|NfeIkhNbiRviWztb@';
			if (state == 'Louisiana') newShape = 'suphEvw~|Pv[wwiEnx@glfJf~Nz~I~tHciRjbGbbDn~Lcj@nrWnlAfhJ{bHssDciRrk\\~aOraCcvIbmKcj@~pJwzVvlIzzKfdLbnM~oMzjDbyJ{jDzdLvvIneGzrOncWncWzcEfiGbp`@vwFnFrrVvvI_bOfoIzrOb|Zzr@jpTrpCwy@noQnbFfnBz_G{vMv~OjqGrfMscLfmEjhN_NchsJv}_AbaVnkX{zKvuj@ko\\beY{zKrkC_fMw{Ic{{@bfLwu[v{I{lf@fgp@cfQrgr@zeXbtkAzzK~si@nhRr}Nzpd@_fC~go@gfi@~_s@ry_@nlgAr~FbhjBsmG~}gAsj_@~wv@wh_@fgqB_f\\j{bDse_@bnpEomMvzGccKv{D_}IzfFwqDoP{_LguP_cQsoFcoE_oF{tIktHwsC~yCcsCw~EkfOzjDwrPcfB{xGvvIsdIka@ssIklLwkL~vB{mEb~EsdIc~E~\\_wBknKka@orCwsHohMcfBsjF{jDoaDo`GktHvcAorCbfBg~DkyCorCkyC{zKfbHorC{zKonJjtHs}D{jDonJnPbwAnxJgkKrlE_jFoeB_jFbnMonOcfB_{Eb~E{sB_wB_lEf}L_lE_oF_lEzrOwuLroFocHohCgqHohCwuQjtHkzObvIs_DrgJoeQ~aO_}fC?_e}@?';
			if (state == 'Massachusetts') newShape = '{dj_Gbse{LkkE_oF?gyeAv~@{dpBjxAzO_eAsgpAncWcGcLgiG~dKsXreAzkAbkGk}AjrDg}LfyNg}Lj_A{~InrHfr@rrB{kAvzQ_{@~rb@ooQjm]wae@_l@{ppD{`]c}Woi_BwvIwiiAzkx@gqCj{|A_he@~|b@ktk@sd`Agmc@~uTggHvyYbwAz`l@khDf}Lj|Nrf\\k}AvkLr{EfeI~yH{Oc~@b~Evj@zfFvaGrhGcwAvlwBwpBfzyBcwAntiCgEzkA~`f@vnMbnu@vbSfyXrkHbdHneBbwF_{@jR_l|@rq@kdgAr~FvGwe@c~E';
			if (state == 'Maryland') newShape = 'oemqFf_bdN?giyE?gkuNbq]cj@j{o@_wBvjfA_sDjm~AsoFroA{ibDfsrAngU{m@ztq@rbEznhAzEj}AjoHv_Csg@nsOn`GnpNvLn{ZseFgr@sg@fpU~nKnkb@slJftS{xBntLciHbvIsoAzbHohHrwBs|LntL_~Ar{Ow`@rcLrSbmP{sGnhRo`LfiGsvEvwFo`L_wB_zCndE~aEzbH?jmIrjFziVcpVn|HciRwwF_rGkyC{dGsrVobFr{@kiFgaK{m@kxF{hJja@ckL_{@weJnqFssIjlL{}BnjQ{bHjnAguFr|Q{r@~}P{m@bqDgiGv`JgmJwcAsaH{`IwgNrgT_IjxKksAvjOcpBzbH{iGgr@wiHfc@kp@noGktCsXcaGguA{YrgJo{A{gCknArtAfaAv{D_`F~vB_hG{Okf@roUshB~yCcfL~qVcLvsHfaAfuA?b~Eb}CguA~_FjtHocCbnMveE~yCns@v{DncCvcAfm@ni@vqDcGveEfbH{YbiRo{AbiRkwIf}LknAfmEshBc~Ew}Cn`GfzFrtA?zjDjoH~nFnlK~iKjoHfeI_~Fr}N~z@ve@rrBjqGntLbmPn{Fr_NznGrgJjjHf{Mv_HnvKvLbfBktH?gpPkCgEwGwjc@kCgad@ce@';
			if (state == 'Maine') newShape = 's}vsGrulpLr{@oxJfeS{uPku^{fFc~EkqGntGo{ZwsWfyNoj[cu[orM{tb@_jKzjDoe[ov_@cnCbyJw{X_~Agh@c~Es{E{kAs}IjqGkwNkqG_}IgiGsePcu[cxu@sgJgisC{euCfdGgpd@fj]zkAveOcm_@knPcor@ksP_xv@bmFg{a@jph@_|t@vhFguPrx{E_{@vpB{jDfy]z~IjdZwq]biCk{e@jlQc~EbiCvjObtTkhNfnQ~iKjv[c|ZclI{nQ~uJ_uWz|w@kh]fuPokS~bo@bmvAbw_@fcsBvdxAvzsCn{Zvia@zkKf`iDvxRr{fAzy|Bjx{A{s[z`]wnMfiVcrP{kA{cYns^o|f@gr@g}qI~uT';
			if (state == 'Michigan') newShape = 'sfyeHr_kzOngx@kttCjvyEgmwOnrp@wfQnha@kwg@rq@khNseFgmEgfAkyCzJkyC_`Aw_C~MobFvwAskH_Nw}C_tFwwFce@w{DnqAojBon@_mGz~DgqCnsO~uEbdHwe@vxHsqEjk@ryAzgHka@bcA{nB~}AnlArbEgqCzgCgr@zfF_hL~kE{OfdBc`E~vGw_CgT{`IcjJ_dNbaBg_LwuB{oSfdB_bOjwSo}Yvxa@f|^j`}AopqEvjtI_tlAvkpBfrw@n`BfpArjFcGv{In`GviHrXzsGrtAbsCk_AnfInlAnmHrrBzgHnn@~uEj{BnbFzbHvpBzgCkRn|HjgBznB~zJrgJnKkCnhRvbSbgD~sUju@vcAnpDb_WfxLz`IzuK~\\fgHgpA~uOrnDzyNsjF~`k@~oz@brA~`xAf_Bn{`Bnx@vnsAwrKvGgEjqsMsymCgtb@crkDncWcd_AcbDwtw@wnMoo`@kmIwnz@c}WsnoAclb@ooe@_}b@oa]gbp@cvg@n~aB?r`bAf_LfeIvgD~vBboT~l[rjFbmPflWb~E_tA~e\\wmAjtH{zUz~I_tUwsHk~Hn|HbzGvn\\_g^kmIcf`@cj@onOn{ZknFnxJs`A~tWkhIodEgnQbeTkvBz}[gfAbzGclDvq]jxAbq]s_DrvTkvBn`GwiRbtm@_re@v{gEoal@rtx@wg`Aobi@kwjA_ho@_}kCszxAfpFcq]sys@oh`CgrJ{gz@';
			if (state == 'Minnesota') newShape = '_gohGbfukQsDg||^st}@fuPsyZblb@wp[fki@ca`@zmc@_tPbyJksKjjp@oqUb}WohRjvy@_{YzeXgueBsgJgwYcvIgy]vae@_mj@w~Tck[c|i@ksFsb^wmK_jK_}cBka@{}iC{s}HzsBcvfC{hlC_vzAsl@~_s@ox@nzl@wqIfmEkyCrf\\jiA~`a@kiAn_Yc~@fyNjyCztb@o{K~rDw{NvrKnmCzaZ~g[nqbAbiCvpo@c|Kn_YcqN~z@{jIvhs@wpLfqCo}EbzGka@vbSnuDvrZ~fOspCjyCj`Rgw^nlPobKjtHstAflf@chFwgN{dGja@wiRjwmBb}Hvlq@buG{OriD~faAwyTjuEkcDjppA{vHbbD~f@zu_@kdPf_o@knPstAk}i@ntLwfQzbHokXnhCgfK~l[blDr_NkxAnpNoyBb~Ev{jA?sDjhtKrlYczGrlO{jDz|T_nI~iUbyJzzs@gqCvnWwGr~d@gyNjop@soUb}WosOn{bAkyCzemBgmEjr]kdPb{l@gmTbvq@cbD~jf@nlAncf@ztq@~r]wbSbaQg`]z}L_qYrs}I{O';
			if (state == 'Missouri') newShape = 'cf|vFnh~nP~kJ{zKbmAcvIv{NcqNjeRw~Tnhf@~aObbb@cbD~`WczGjkY_bOvfGcvIbhZgse@fd[g`]nu]o~j@b}p@wsHnjVwfQs_SwyYvtO{ps@juJ{zKfwT~aOvuy@~qV~h]nxJraz@s{uAjur@gimAv~w@okSj{VzmTfoSwfQzaP{zKr~PwfQchFwbS~eHgiGbhFwwFv{]jhNnd^jyCjkOrkH{lM~yRfuKr{OnsJrwQniY{ObeTvGfr^zvMrjP~yRnZzg`CsuWohRkn_@clb@szRcfBw`Er_N{oN?rSv~fZ{ibNsXock@?fyDfmTgrTrb^wbv@n~j@ks_@o~j@cxRvcAcvI~qGwmAr_Nb}Cr_NoiYb|i@gwm@zu_@opNr}b@kfr@nlPns@_bxGkgBcfqIgnBofdD';
			if (state == 'Mississippi') newShape = 'svstErtdfPgTw~zKrhVswQv{b@jyCjxiEn_YfcyIjsi@fygE_gJj}hCgmErmLbmvAklVjedAvlIrpz@glCvjOg{\\ntLgfd@zeXk}ZjhNc}_AgpU?vipJs{EwkLc}M~bL_xIc~EwrKrcL_{EstAj\\_zR{wTcfBkiFwcAo~QsXccKgaKgoIbrKkMcaV{z_@czGcwKs_NwwUk|S__IguP{dQ?_pMgmEkmDgmEscQk`R_qJbaVsdI_{@{fFr_No`[guPniE~yR_tK~qG_gOwcAksK?wrKvcAclDgmEc_HbiRglMwcAswGcj@orM?{pKk`Rgo]jtHgcOvcAgfAbrKc`TrpCsaMwkLkoMvkL{w@ktWgzPbfBjqBciRknKwcA_|GfmEknKzgCk{GwcPobFs_NwmKohCwzGzzKobFcvInbFgaKoeQbjOozIk|SsvJghYosEo`Go~Bc~EwzG{~I{qMj}AcuLzr@gw^{bHk}FohC{|OoxJ~|DciRglC_jK{cYj}A';
			if (state == 'Montana') newShape = 'womnG~txdTs_q@n}|@rvTzaZnzNwwFzqCnpeAsrGz~IzaFjok@guAjzh@nlPjiKcfG~faAz}LzqRfaKrpCwgXnv_@_nSn|Ho~[jqGwuLjwXn~BnhR{g\\jo\\{fPcnM_mo@~wv@gd`@jdPca`@jqG__NjwXb}Wrb^faAzjSbfQbiRkpOrnX_yA~yRo{UczGgbRfiG_ePglW_{YfiG_kWzcEodY_kH_{OskHsgT{jD{oIo`G{_[c_CfiBbyYoPb}WsoKfx`@ovZ~d_@{se@~|b@w_\\f{a@shLb~E_|Grre@o~V~ok@gbWwGg~DsgJgulAvkcAorfE??c|ehAfyfW{cEngA?jlBbGzJz_|i@rvdBvG';
			if (state == 'North Carolina') newShape = '{ygmEfb`~MgwcEnggFshBb}zE{zU{kAga_@rf\\j}KfqRcoTka@{}BjedAcjE~glD_b@fiVnlZ~yiAooB~z@b`Ovw}@vo@nwbB?fahCcfj@odEcvI{zKffFsvTszH{zK{gWw_Cc|K_bOkvGs{OgwEct^_hBcia@ksKo_Yk|NwyYsyKsap@wrKwkL{eNceTwiMskHkxK{eXjxPodEz_BgiGsmL{nQsmG_nI{vH{zKsmBscLgkAsjZ~lGspCspCswQsz\\{uPggMcyYvfBguPkep@c~EbiCgjxDbiCscrA{E_`yB?gawM_b@c|cH~km@wsHvctB{kx@flbBjpJj{j@nvtB~qwAzaqAwcKvt|@v`Jbz~@nlZjr{@b~aAvkcAj~u@b}WsxDzllB';
			if (state == 'North Dakota') newShape = '{l`jHbhazRv{rQka@r`Akmsl@wekAb~EghaAvae@wke@gr@crP?cbb@jqGclS?{{a@nhCsbY?cgSzgCosaAztb@cjYzzK_b^k}Agd[nlAc_W~vB{bWgiGs}Ib~EseKzfFgaUz~IcrPrXnUfmrh@';
			if (state == 'Nebraska') newShape = 'gdmeGjbbzRjydK?bLcjfKnwaEcGfYgmch@c~m@bp`@ciMvm_@o{UzgCwe^zyNkbQzjSkrX_{@or\\{kAogUjuEsqh@ja@k~\\~iK{tNbrKkzTbiR{yXw{Ds~KvwFcqX~rDcwKvbSsbO~uEg|ObjO{iGw{Dgd[zuPslOk}AwmK~hl@_mLvnM{gHw_Cwj@~eMssIr_N_hGbyYg`Ifgk@chFbbD{iBr~_@f}BfpUce@~yR{iBz`l@bfVnw\\{|Ovu[otQzgz@scLjmI_Xzl{`@';
			if (state == 'New Hampshire') newShape = 's`wqGbvlsL{kFoi@gkFw~Eg|JkuE{eIodEkfEjtHgEsgJgrEcbDkfEkhNfeIkmIngAskHku@gqCrDkyCsjF_wBocCw{DnwiAodEvbmB_oFnsxBk|Dnl_@ccAztg@fr@jgLkhNvaL{nQbyOfnBz_GwoJvxHcuLn|W{aZv_Hz~IrcBril@cbD~eMzvMvrZoKzyNbiCbzGzyIsXc~@jiK~`Hb}H{w@r{uAkvBr_kCs{En|HomHndE_zHfnBogF{jDkrIzr@ciCskHscBcbDciCgnB_cBrpCciC?kaEc~EciC~z@ovAwcAsgE~yCkwIcbDw}Hja@g{CssDscQja@kjWkuE{uAv_C{xLgqCgmJcrKgrEwcAwlDja@o_EsoFcwF{zKwuGcfBcnH{OggC{jD{lCkyCsqE{kA{~IoPkkOotLcsCfr@kpEcfBkpErwBorCzkA__IgnBcqDfr@{zFodEsmBo|H_fCwsHflCsgJw_CsgJs}D{OstAgmEobAwwFwvDkhNglCka@klGklLopDccAowCv{Dkp@k}A?_zCgqCoeBkp@neBghEccAcvD~nF{kKv_C{oDfqC_cLgaKknAohCwdCzOc_CgjD{kFcbD{vCneB{mEja@cfBv_C{_Bw_CgzA_wB';
			if (state == 'New Jersey') newShape = 'oql{Fvz{fMfnBksFnqbA{xsC~~\\vrKzxLn|HrrLrtA~`Cv_CjhDzfFvy@bvIkRbyJnwHrXfpF~vBrmLb~EzfA_sD{qHs|t@j}FgaKrw|AzbHfmkAftSzaZjcb@v}}A~}vAfxV~|b@~vBzpd@c{g@rrV_he@bq]kqe@vxk@gbHni@_SslEcaGja@wyE_zCohHfaKohHoxJwzGcbDg|OklLkkEow\\k`Hg}Lc`m@o`mAgbCkpJk}UfpUopNvfQ{zKv{DohCfuPgzKwG{hOvzGvy@j|SsxIwcAw{DrXw}a@ktWsyA~vBoaDwsH_|Vr{Oonm@oqs@gdVogUfE_sDolAssD';
			if (state == 'New Mexico') newShape = '{~x`F~xpxSfcqa@rXoFcabDwyuAcj@{TgffIo`j@fuPzTk{tTkfo]scL?nu{c@';
			if (state == 'Nevada') newShape = 'grh_Gbfm{Usq@{bnK?gkuD?oe|Fz^_khI~osUvcAbfwKka@bcKvsHfeDzjDrmBwcAfhJ~nFrmBvfQ_pH~aO_yFka@g_GzzK~xArrVsmBvcAsv@jqGviCvvIrmBzzKfnBjdPjxFsoFbrAbfBnwMwcAj{L_oFjjC_rGfnBjtH~aEwcAfnBzgCjv[{gCbjJktHjjCroFbjJgmEznBfmE~eRg}LnsOohCz_[_wB~kJb~Efw@fjDnoB?znBslEvgDnhCjsAzgCzcEka@_nXrb^spxKr_qOssxI~mdNwxgQ{O';
			if (state == 'New York') newShape = 'wpnbG~qyeNsqr@_xfCcdMkpYsxIssDcsHrsDwQjuEw{Dz~IgiL_wBs|BntL{xGwGciC{_G_`FfjDshLnPgmErpCsc`@jxUgeb@kobBgEkcqJgrfAoey@gbRwoJ_oFosO_oKo`God@klLobFwgN_}Iw{Dg|EkdPglCgaKoyBo{KcxCgbHgcEc}H_mG{kAckLgyNwzVkg`@s_Ssf\\ckGwrKgoD_oFcvD{zKkmI{iVwwFsrVgxB_{@s]opNcfBkyC_tAwvIzaAscLzJ{~InKo{Zju@kppAchAsgpA_]kr{@_NcbNzqCbhAflC_hB~oHrIvvNjuEbtEkbGfrJjuE~~Wv_C~zEstAj_PklLzfK_{@~cNn`GnwMkyCrdNntLvjObbDjiK~rDfwEw{DvlNvGnxJgmEnxJbfBrjFc~Ef~XjlLjaJ~z@vsC{fFs|Gk}AkbBs_Nz{HvGrv@skH~vGstAbtr@rtAz~v@j}Ajl`@bfB~rIgqCvgv@nkSv_iAzaZvcK_wBfpZ~z@jjqB~mIrbOcuLbyTrtn@vbNkiKfpFgh@vtEwuG_bm@c{{EgiLssjAwzGocWk_AsdIvxWw}WboJvGzjNo`GndpAnjhFfiQzycBrkHrcrAsvEbyJn~Gbiu@sv@bbDkk^g_L_v@kwXwvSksFsbTkjMs_XkoH{aF~}Pccx@nk|B{cEfyNomCrIkfJnvUsmL~d_@caQzvMk`Mw{DsrQznB_eU~iZcpVjk^fEf}LgE~gxHnK~fmOgEzfF_sb@?ky_A?';
			if (state == 'Ohio') newShape = 'soriFroquNgyXo|Hg`D{iV{ba@zjDcfo@kg`@j}Zcq]s{JceTg}o@kyC{nQcp`@gsVocWf~IkhN{{Rsen@w{SolP_zRgse@kfh@giGs{lCo{ZgoDo_Y{wjIrXrsSnlmCjxi@burA?~rD~i}@zbeCbe@niw@odw@~esAjjk@vxz@ffFfqlG~rxNj}AkzE_fMjvG_lm@bxH_zRr_S{iVz|YshGjuEwq]rwBwae@bfV_pk@_jKcyYfgRkjp@swB{eXgwOwvXozDgpUrd]gaKbnf@{|m@';
			if (state == 'Oklahoma') newShape = 'kzy`FzdusRrj`BwGnZgriQvfyJcj@rgc@gnhAwhFsoFvhFsf\\{`N{bHv|PwvXj`\\klLzzAgki@vsM_mj@wLwec@nlK_bOopN{qR~wDwae@ftSk`RvjTk`RjjHcaVkrXgx`@buQ{|m@j|Ifr@b[ciRo|M_m[jw]sdIfT{}Lgie@cia@fuKwrKrmG{jSbj@gwc@rmGcvIrvO{y]gm^cz~@vmAgtb@{qHwbSv[{pd@j_A{tq@_gOo{KnqP{u_@rkRg|^vdRgki@b`E_}b@sfmIktH_pfEbt^{}VnhC_maBbGwLbwdr@';
			if (state == 'Oregon') newShape = '{{iyGnniuVk\\ofg@s_D{nBnmHcjOzJklLk|D{eXziBgeIon@o`GzJohRkz@cyJj|D_gJ~wI?~|DgeIzJg}LolF{`]vsHgeX~xF_bObkGwvIzxQ{zKjmI{ObnC{jDzuKfr@~mI_oFfjNbfBfwEohCrrGsb^roFko\\co@g}Lf{C{bHksAcaVgwE_rV_cL{pd@s~A{OcgDwnMzfAoxJ_sDsmj@vjEo{Zs~AcbDzvHkk^zvHgr@{JktHwfG{zKgc@{zKzfAgmE_{@_oF~vBgmE_oF_gJgnL_ho@jrDwnM~vBsgJofD_}b@?s_N_kHcvIsuHk_d@krDs}b@co@caVweJgeIkz@o`GvrAgbHofDwlq@fbCciR{|Jg`]_zCw{Drb@g}rKryF_oFn}JswBfbCgeI~qGoeBzfA_zCkWcvIzzFc~E?oxJf~Dg}LrjKoP~~MopNzwTrwQvcF?rwBv{DfbWnsOniJzgCzxVroFbyEjqGreFzr@raHnxJfbHbfBzbHgmEjfY~yRncHnkSne`@jdPnnEnhC~zJjiKfc@rwBvdM?rtAzgCjeHcvI~eHfmEbaGktHkWslEczB_rGnrHwsHsmB{r@zc@kiKnrHka@nkDcqNrfMroFz|@~nFzcEbfBblDsgJj{Lb~Ev{XvvI~r]ja@jocI?rXnn~Xw~@jslFbLzdpBsXvnMbe@jdPnKv_iA~k@byvCs`_@jo\\_g_B~nFgc^n{ZciwDgf}@suvLcq]ggp@wcA';
			if (state == 'Pennsylvania') newShape = 'cyiaGv`mjNotLs_tAwpV_o}@nzcBwGnK{{zY~wI{uPjjMkdPjeR_rV~eRohCnyLzjDjgQg}LztN_|e@vyEs{Ozf_@f`]n{n@zst@n|Ws{Onca@vrZjxUnhC_`A{mTfgMshGbvNja@~sAkdP~gL_vEn|M{jSbcU_yUjdd@nlgAvzV~d_@fvC~`a@cuBnbi@vyTjsZcLjy{[oe{NsX';
			if (state == 'Rhode Island') newShape = 'geo{F~gupL?{Oslr@fuPoyGjtHo_OzrOoeBfeIkxAvcA{~Dfr@krDstA_eFzO_~F~qGo}OgYnx@bypAfv_AwcAnjj@vcAzmJn|HngKnPf`DrdI~qVw~T_}NkyiA';
			if (state == 'South Carolina') newShape = '_prbErvpkNzTrre@ovKnbi@srQrsDo|a@vwFggMbfB{xLjhN{yIvvX_gT~z@ouXz~Ik{VzfFsjK{r@kgL~`Rc_H~uT{cOjxUg|YvbS{aZrwQwbSziVg{RfxQ{gM?_rLzfU{qRfd[wtEbzGsiXfpUc_MjpJgqa@f}LcuVj`RseAnhRsdIfxQokXfgk@spMzbH_kRcyJwuQow\\_aMo`Gc`Ooy~@gqW{jjAb~@cp`@vsH_}eFfeSka@ceJgqRzu_@ko\\vmUrtAfzA_ryE~xtBopkCrknAog{Avp[zgz@vhvAv|x@nduAjafAvom@~afAbr_@~faA~c]njt@~o\\r|t@';
			if (state == 'South Dakota') newShape = '{ilwGbhazRrk}PnP~p@_u{`@j}KcvIboOwpo@r~K{aZvwAgyN_|Q{iVrq@oqyBzsGspCv|P{vdA~nd@ggk@raHwrZkjp@z}[{st@glWcbX{zK{dQbaV{y]w{DktRjdPw|Aoz]kf~IcGos^niw@km]zjSg{f@kfr@ctTw_Cs`Afaul@';
			if (state == 'Tennessee') newShape = '{zy~EvvoxOroFobi@zmEkcnXbo@sprIwzBswBrS{ps@~~u@brKciCfyNvqIzmTfla@ncWntBznQg_GnhCjdAj`Rz_Bj|SfbHvrKrdSvzVsSjlLoqPv{DbfLbyYnwMfiGftIr{On}Oj`R~dK~km@~e\\~cq@vrArre@nfDfhY~gBz~IzoSrjZbtTnPjkJbjOw{DbaVfiG~iKfel@zjD_eAfoqc@cdW_sDgzAceTwyJwrK_{On`G{v\\gnBojVgpUkta@crKocWchd@svJ{qRk~MjtH{sQ{fFsjFs{OsgJvoJkoHfeIotB{u_@saHjdPgvHgiG~u@oxJwl]bfBkxAwxk@rjA_j}E{Ek`Rgrc@ka@';
			if (state == 'Texas') newShape = '{xnaEzvmiSzpUscLvsWwae@ni^ciRvdMgpd@fjg@{`l@fyb@{dj@nk]_e_@f}e@kxlAjar@ko\\~oWodTbec@geIrs]guAbx\\gmTryUkxF~_PocWngPsre@bhPo|HvhPsza@~xAwrKzhE_~PjpT_dq@~qLooQrgJg`]~yHg`]_gJ{zKsoU{zK{cOct^_~Fv{DcsRoxJ_}X{fFkve@gqRgyNonc@jz@{eX_hVopNfsQg`]vbDs~vA_l@kwg@~aYgse@jhSc~Ezw^wip@fmJosOvrZsf\\~qLotLvwd@cuLzfn@o_Yvmd@cyYr`d@_jK~nPocWnnYg`]zhT{rObbb@guPbnRkwXfeb@{`l@nwa@z~IjuTceTbsa@bfBfhY{eXfie@{mTjvt@gmTvqIcgv@bvXwu[wt@giVfgRw|i@nqP{y]ce@g{p@ncHoyo@jz^kfr@kxKwsHcyJg~`Aweh@bvI_g}B~h]svsBsf\\sk{B_}yAc{eA{_dCof`As`yBw~|@oboBo|z@c~kA{dj@wqcB_|e@~uT_jUcaVo_YguPcdMgqCkwNnhC{`NgnBwnHvoJc{IsXssIsgJ{sLvG{oDzjDwfQcyJgzUoxJ_tK{~I_aMnhCwqI_rGwkQspCwsH~vBk`Rbj@bhAbrKs`ZnsOkcNolA{oIznBglMzcEs|LrvTobK_wBorMbcAorMvcAchF~qG_}IjqGgbH~qGgqMr_N_d|G?ciM?{jDfmTkqB~qG?zzKjqBbvInx@r_NkqBfmE{jD?wcFnhCnx@~nFox@b~EgjDrjZwcF~aOggMf`]{`Svia@smGr_Ns{E~eMvtOnxJ{w@bsp@w[rji@jjHnsOo{Avec@ji_@vp~@cb]zwr@_|GkuEsb@bjO~cNr{OgnGbqN?jqGkcNroFn~e@via@sb@~eMsz\\jmIruMvq]_q@r{O_|Gk}AcgSbpo@fyXjg`@wxHzqRsxXn_YgmOr_NopDj{e@riNvbSsbJnwMkMj{e@kzOzlf@vLfmToi@ziVoj[rcLo|RvvXjkOjtHgpF~iZvzG~qGo|R~xd@stP~|b@_yxJzr@sSjqpQbzmZjyCoFrrtT';
			if (state == 'Utah') newShape = 'wey`FzebwToZccp]_nkWrXoK~~dK{`bEzOnx@r|fQvim]bcA';
			if (state == 'Virginia') newShape = 'swk~Eryu}NwxHogUg_BcaV{nG_lYsnDgrToZ{|JkuJodEwgDwGgvCslEfh@sgJsqYsb^kyC{~Io}E{|Jwkj@gojAwmF{bH_ff@{mw@wjEk{GruCwfGf{C~vGvjEby@vkBgiGbqNka@f}GotLvbD_jK~vG_fM~bG{bH{m@{gWszHs}InqAoqAwqDspHcxHooLvoJwfQgh@caVg~Dwia@{fFocW_kHnhC{fF{jDrsIopNkmSc|i@{YsoFrsIgmEgrOsza@wbDohCcLjtH_hQokS{mJr_NoxE{bH_|G?_oKwoJgzFczGcc_@g{a@ovPgjDwaLsoF_|LcaVs~FjyC_uH{bHnn@cbDo}Eoi@oyG_rGg_Lja@w~OczGbcFkxUjgQoxJ~}Fct^ciR_zRwa[k|SccFcfB{iBbfB_vJ_rGwdCnP?c~EghJk|Dz|O_rVoyVguPwdH_jK~~Ccj@{eNwjO~vBkyC__IgeIwdC~yCgyIklLgyIs_N_wB{jDk~CzjD{{\\wfQknF?wvNrv@~km@cwgArmQgd[__b@{nQ{r@sdDfiB_`P_NokIz~NkzTrwLzzKfeDrIzaFozIfxBg}Bvt@gtSfnB{qH~rDciHzrEwGb|A{|JvkGg}LnyG_yKnrWoKnvF{Tz{HjsPndE{O~nFzzUnbZvmKzpK_]n{FgwOcqIwq]keCc~ErwVkqGngPk`Rf_Gccx@r|j@wkcAsg@{pd@ju@ceTbrF~z@w`@wn\\_yFk|Srg@wzG_pH{gCsoAwm_@goDsn~AnxbCvpuBjmyAz|m@v|bAstA?r`bA?bnjC?z~Ivo@?{h@jfr@~a@zzbAvLndwO_yArh~@ka@b}WrSjtW_v@z{p@oqA~zfAzEbbDo}@rza@ohCodEka@r|t@fvCzkAwLrzxAvLjchBwLvs_Agh@n|nA';
			if (state == 'Vermont') newShape = '_bvqGzvs~LwQ_g^{J{ytAzJo_Yzc@cvIkHciRb`@sh[cQc~h@oAsxb@oi@kgcA?sgJvrFzqCreKsvEzcOfaKvlNf}LbkGohCnsJ_oF~}KssDnpDfaKrkCoaDr{ErtAzxGrcLz_GvoJvhAzyNn`Gv_CnrCjmIcaB~qGf|@jeMvoErkHnbKfr@vxHfqCbjJw{DzuKnhCrhLrdIfwEoeBjkJzcEv|FrkHjhNbbD??z`IvwF~kEfaKr~KbbDfvHbfBjp@b~EzjNznBjWcfBvjO~vBbvInlAfEohCb`EfnB~cIgr@neGzfFfqHzkAbqIcG~iKzOn}Jcj@biCbbDr|BrgJvpLja@~aEv{D~cNkmIzbCni@jdAshGn|Ck}A_mBzq~C_}Ij}AonEwe@gjl@ojBkysAw_CsqJrv@kbBfkFsuHvcA?n|HnsJzdG_aCvyEocHsXcoEw_C{wEojBwaLksFg{Hn`GwjE_{@owHrtAonEbhAwkG~\\_jKjyCkiK_uCkzOcdC_fHcxHgm@suCszRnhCw_CcLwmKkqGkhSvyE_xI~mIguKwe@ovPsv@olFobFgsBjC{|EvsHgpKw}CcwAojBw_HoKo`BbfBkyCgw@kf@?bBcL';
			if (state == 'Washington') newShape = 'kwajH~auoVoAw`w@rD_f|Db[ku|@gJ{y]gJwhbKnA_vqHrD{mcEvwiE~z@fg{GcLfjN?~cNzlCffA_vE~mIwwFn~Gw{DvcFfr@nzDc|FftDj_AjgGzlC~jCfnB~yCslErgJofD_]bayEfErgyDvfLz_[fYv|FolAzrO~\\~oHvrAbtJ~\\vnMr`An|HwpBveOb`@rsDjiKjlLvt@~kYr|BnkSrSnzIrtFftSbnCzlRbcFb|Fr|Bvs\\faArmVwbIrvTrDvwFbeE~kJvfGf|^~aE~kJ{dBrlEr~AndEwcAfwOzxG~aOcBfkFwmKfmE_qEjvVbmAfaK{mEvvXnjBr}N~xA~vV_jAviMj_KzgWnbFrvTj~CvmKcBrqEfnBjkJbiC~iK{Y~gLgjDfgH~iAbtJgfFnaXwnCjvVgwEnwM{qCj_AopN{pAcsHjuE_nI{kAwiHzjDorHfTouIjqGotGbbDomCfsBoyBz~I_iIvdRc`EjiKoPvzGjvGfkU_NbmP_{Ez|JkeH{OwwFzzKbcAz|JrDnvKnn@f_LgxBriIbtEb{XsSz~IwvDzdGkyCbxHjhDbhArb@zhh@oo`@jyCgqnAvjOwhbAzrOsxv@ncW{{_Avae@{an@rvTgvf@?wxWswBspW{nQ~iPcv`AruHsza@zkKskk@rhBk`RnuI_ygAouDksZw{Dsf\\_eZo_YozD~qGkyRz|Jg|EngAkoRroFwbNcor@wmK?wk`@zc|@';
			if (state == 'Wisconsin') newShape = 'o`nbGjfdhPfdBwi_UkfjDncWc{{@kyC_z}AkwXwe|@o_YollAkg`@kjdAs_tA{og@n{`BoKrccAzuPntLfaUbu[v|FzuPzsVjuE{}B~xd@w_WrgJwmUwsHwxHvsHntGrb^obZoxJg|O?ceTcj@gzUnfg@kxArrV{uKo`GsnNrkWsvJntcA~}Af`]g_GjsZsuRf_o@kof@v{gEo~j@~sx@ozkCoowA_kCz~fCbrtBv_lGjnUnuq@j|cBzObhKnxJzaF~d_@f|^jvj@z}e@fmTj}KgyN~bVkxU~tWbvIb`aAfmEzqa@nhCzhY_uWf`Sw`w@nsO_~PngKgse@ne[chd@nte@gcm@nhRgd[nuXcia@~fc@o{KrzW{gCrsb@ohCf_Gg`]r_XvvXffZslEj}UwcAvcZkdPrdNcor@jfJkdPnhW_fM';
			if (state == 'West Virginia') newShape = 'oqlqFbwadNzecBrXw}u@wrqAbiH{rOo|f@gse@b{SokSjbBswQ?gmTcvNwvIolFsgJvuBotLgkKo`G_{@scLzxQsqw@rfR_aRnj`@cvI~`f@rwQoc_AvqcBnqUcGra\\bfQfeD_sDrlYvm_@zuAswBftXril@r~UjdPwgNziVbjYrsSztIja@ryn@fse@wsHrza@wnMfeIwgIjxUjoRrkH~xKzO~xKbuL~oMjyCjhXn{ZvbXbzGbhZ~h]na]vzVnwHrsDnwHklL~sPvbSnn@kuEjkEj}AvvN~`a@_jKjuEz|Tnuq@{eI~}PriNwcAb{Ij{e@fjDrmj@_yKvfQzbWnnc@fh@baV_pMrwQg~D~yRsjK~iKgiQjqGgrE~mIw_WflW_jd@rre@{kn@fse@k_ZjdPs`d@giGsvE_vTc{Dgd[{}[_nIwt@_vTocf@~nFoqi@onc@rsIkiKr{OcmPobKceT{qMwG{iLstAwiRka@osOsb^k|XcyY~oH_bO{jIsnXkgLc}WsrQciRohHguPgzFkdPo|\\kyCorM{nBnpDr{@wao@ktHwlXspCob_@_vE_we@{bHojGktWrtpDwG~Ro`jE';
			if (state == 'Wyoming') newShape = 'cpgyFnjbzR_pjWnPs]zhui@nnlWgr@oKcgti@';

			if (newShape)
				this.selectedShape.setPath(google.maps.geometry.encoding.decodePath(newShape.replace(/\\\\/g, '\\')));
		}

		/**
		* Load a custom shape from geojson data.
		*/
		loadCustomShape(geodata) {
			if (!this.selectedShape)
				return;

			if (!geodata || !geodata.coordinates)
				return;
			
			// Get points from the geodata
			let points = [];
	        for (let i in geodata.coordinates[0]) {
	        	points[i] = {
	        		x: geodata.coordinates[0][i][0],
	        		y: geodata.coordinates[0][i][1]
	        	};
	        }

	        // Simplify the points
	        let simplePoints = window.simplify(points, 0.025);

	        // Convert to google maps path
	        let coords = [];
	        for (let i in simplePoints) {
	        	coords[i] = {
	        		lng: simplePoints[i].x,
	        		lat: simplePoints[i].y
	        	};
	        }

	        this.selectedShape.setPath(coords);
		}

		/**
		* Duplicate the selected shape.
		**/
		duplicateSelected() {
			if (!this.selectedShape)
				return;

			let that = this;
			let shape = this.selectedShape;
			let polygonOptions = this.drawingManager.get('polygonOptions');

			// Create a new shape
			let newShape = new google.maps.Polygon(polygonOptions);
			newShape.type = shape.type;
			newShape.id = new Date().getTime()+'_'+Math.floor(Math.random()*1000);
        	newShape.meta = this.setupMeta(shape.meta);
        	newShape.meta.color = shape.meta.color;
        	newShape.set('fillColor', shape.meta.color);

        	// Iterate over the vertices
        	let vertices = shape.getPath();
        	let coords = [];
			for (let i = 0; i < vertices.getLength(); i++) {
				let xy = vertices.getAt(i);
				coords[i] = new google.maps.LatLng(xy.lat() - 1, xy.lng() - 1);
			}

			// Set the path
        	newShape.setPath(coords);

        	// Add shape to map
        	this.shapes[newShape.id] = newShape;
			newShape.setMap(this.drawingManager.map);

			// Add listeners
			google.maps.event.addListener(newShape, 'click', function(e) {
				that.setSelection(this);

				// Set coordinates
				if (that.listenForCoords) {
					that.setLatLon(e);
					return;
				}

				// Delete vertices of a shape
				if (e.vertex !== undefined) {
					if (this.type === google.maps.drawing.OverlayType.POLYGON) {
						let path = this.getPaths().getAt(e.path);
						path.removeAt(e.vertex);
						if (path.length < 3) {
							that.deleteSelected();
						}
					}
				}
			});

        	this.setSelection(newShape);
		}

		/**
		* Select a shape.
		*/
		setSelection(shape) {
			if (this.selectedShape !== shape) {
				this.clearSelection();
				this.selectedShape = shape;
				shape.set('draggable', true);
				shape.set('editable', true);
				shape.set('strokeWeight', 2);
				shape.set('strokeColor', '#06fe00');
				$('.show-when-selected').fadeIn().css('display', 'inline-block');
				$('#form.show-when-selected').fadeIn().css('display', 'block');
				this.populateMetaFields();
				this.updateMarkerPosition(this.selectedShape.meta.lat, this.selectedShape.meta.lon);
			}
		}

		/**
		* Unselect all shapes.
		*/
		clearSelection(e) {
			if (this.listenForCoords) {
				this.setLatLon(e);
				return;
			}

			if (this.selectedShape) {
				this.selectedShape.set('draggable', false);
				this.selectedShape.set('editable', false);
				this.selectedShape.set('strokeWeight', 0);
			}
			
			this.selectedShape = null;
			this.marker.setMap(null);
			$('.show-when-selected').hide();
		}

		/**
		* Delete currently selected shape.
		*/
		deleteSelected() {
			if (!this.selectedShape)
				return;

			let shape = this.selectedShape;
			this.clearSelection();
			shape.setMap(null);
			delete this.shapes[shape.id];
		}

		/**
		* Update marker position.
		**/
		updateMarkerPosition(lat, lon) {
			this.marker.set('position', new google.maps.LatLng(lat, lon));
			this.marker.setMap(this.drawingManager.map);
		}

		/**
		* Set the lat and lon of selected shape to mouse coordinates.
		**/
		setLatLon(e) {
			if (! this.selectedShape) 
				return;

			this.selectedShape.meta.lat = e.latLng.lat();
			this.selectedShape.meta.lon = e.latLng.lng();
			this.updateMarkerPosition(e.latLng.lat(), e.latLng.lng());
			$('input[name="lat"]').val(e.latLng.lat());
			$('input[name="lon"]').val(e.latLng.lng());

			$('#set-coordinates').removeAttr('disabled').html("Set Coordinates");
			this.listenForCoords = false;
		}

		/**
		* Setup a new object to store the shape's meta fields.
		*/
		setupMeta(metadata = null) {
			let meta = {};

			for (let i in this.metaFields) {
				meta[i] = this.metaFields[i];

				if (metadata)
					meta[i] = metadata[i];
			}

			return meta;
		}

		/**
		* Populate the side panel form fields based on the shape's meta.
		*/
		populateMetaFields() {
			if (!this.selectedShape)
				return;

			for (let i in this.metaFields) {
				$('form input[name="'+ i +'"]').val(this.shapes[this.selectedShape.id].meta[i]);
			}
		}

		/**
		* Save the map.
		*/
		save() {
			let shapes = [];

        	for (let k in this.shapes) {
				let shape = this.shapes[k];

				if (shape.type == google.maps.drawing.OverlayType.POLYGON) {
           			shapes.push({
           				id: shape.id,
           				type: shape.type,
                        path: google.maps.geometry.encoding.encodePath(shape.getPath()),
                        meta: shape.meta
                    });
          		}
        	}

        	this.ajaxSave(shapes);
		}

		/**
		* Perform an ajax call to Wordpress to save the data.
		*/
		ajaxSave(shapes) {
			this.disableSaveButton();

			let that = this;
			let data = {
				action: 'save_vector_map',
				shapes: shapes,
			};

			$.post(ajaxurl, data, function(response) {
				if (response == 1)
					that.showResponse('success', 'Map updated successfully!');
				else {
					that.showResponse('error', 'Oops, an error occurred. Check the console for details.');
					console.log('Oops, an error occurred.', response);
				}
				that.resetSaveButton();
			});
		}

		/**
		* Show a response on the screen.
		**/
		showResponse(type, message) {
			let alert = $('<div style="display:none;" class="alert alert-'+type+'" role="alert">'+message+'</div>');

			$('.alerts').prepend(alert);

			setTimeout(function() {
				$(alert).fadeIn();
			}, 30);

			setTimeout(function() {
				$(alert).fadeOut(function() {
					$(this).remove();
				});
			}, 3000);
		}

		/**
		* Disable the save button when saving.
		**/
		disableSaveButton() {
			$('#save-button').attr('disabled', 1).html('Saving...');
		}

		/**
		* Reset the save button back to default state.
		**/
		resetSaveButton() {
			$('#save-button').removeAttr('disabled').html('Save Map');
		}

		/**
		* Built out the color palette for the toolbar.
		*/
		buildColorPalette() {
	        let palette = document.getElementById('color-palette');

	        for (let i = 0; i < this.colors.length; i++) {
	            let button = this.makeColorButton(this.colors[i]);
	            palette.appendChild(button);

	            this.colorButtons[this.colors[i]] = button;
	        }

	        this.selectColor(this.colors[0]);
	    }

	    /**
		* Make a button for the color palette.
		*/
	    makeColorButton(color) {
	        let that = this;
	        let button = document.createElement('span');
	        button.className = 'color-button';
	        button.style.backgroundColor = color;

	        google.maps.event.addDomListener(button, 'click', function() {
	            that.selectColor(color);
	        });

	        return button;
	    }

	    /**
		* Select a color from the color palette.
		*/
		selectColor(color) {
			this.selectedColor = color;

			// Show selected color on the palette
	        for (let i = 0; i < this.colors.length; i++) {
	            this.colorButtons[this.colors[i]].style.border = this.colors[i] == color ? '2px solid #000' : '2px solid #fff';
	        }

	        // Change map drawing color
	        let polygonOptions = this.drawingManager.get('polygonOptions');
	        polygonOptions.fillColor = color;
	        this.drawingManager.set('polygonOptions', polygonOptions);

	        // Change color of selected shape
	        if (this.selectedShape) {
                this.selectedShape.set('fillColor', color);
                this.shapes[this.selectedShape.id].meta.color = color;
	        }
		}

	    /**
		* Built out the form fields in the side panel.
		*/
		buildSidePanel() {
	        let form = document.getElementById('form');

	        for (let i in this.metaFields) {
	            let field = this.makeField(i);
	            form.appendChild(field);
	        }
	    }

	    /**
		* Make a field to add to the side panel form.
		*/
	    makeField(key) {
	        let that = this;

	        // Container div
	        let field = document.createElement('div');
	        field.className = 'form-group';

	        // Label
	        let label = document.createElement('label');
	        label.setAttribute('for', key);
	        label.innerHTML = key;
	        switch (key) {
	        	case 'citystatezip':
	        		label.innerHTML = "City, State, ZIP";
	        		break;
	        	default:
	        		label.innerHTML = key.toLowerCase().split(' ').map((s) => s.charAt(0).toUpperCase() + s.substring(1)).join(' ');
	        }

	        // Input element
	        let input = document.createElement('input');
	        input.setAttribute('type', 'text');
	        input.setAttribute('name', key);
	        input.className = 'form-control';

	        field.appendChild(label);
	        field.appendChild(input);

	        // Listeners
	        field.addEventListener('change', function() {
	        	that.updateMeta(key, $('[name="'+key+'"]', this).val());

	        	if (key == 'lat' || key == 'lon') {
	        		let lat = $('input[name="lat"]').val();
	        		let lon = $('input[name="lon"]').val();
	        		that.marker.set('position', new google.maps.LatLng(lat, lon));
	        	}
	        });

	        // Button for setting coordinates
	        if (key == 'lon') {
	        	let button = document.createElement('button');
	        	button.className = 'btn btn-small btn-info';
	        	button.innerHTML = "Set Coordinates";
	        	button.setAttribute('id', 'set-coordinates');

	        	button.addEventListener('click', function(e) {
	        		e.preventDefault();

	        		this.setAttribute('disabled', true);
	        		this.innerHTML = "Waiting for mouse click...";

		        	that.listenForCoords = true;
		        });

	        	field.appendChild(button);
	        }

	        return field;
	    }

		/**
		* Update shape meta when form field is changed.
		*/
		updateMeta(key, val) {
			if (!this.selectedShape)
				return;

			this.shapes[this.selectedShape.id].meta[key] = val;
		}

		/**
		* Load map data.
		*/
		loadMapData() {
			for (let i in this.mapdata) {
				this.loadShape(this.mapdata[i]);
			}
		}

		/**
		* Convert state names to abbreviations or visa versa.
		*/
		abbrState(input, to) {
			var i;
		    var states = [
		        ['Arizona', 'AZ'],
		        ['Alabama', 'AL'],
		        ['Alaska', 'AK'],
		        ['Arizona', 'AZ'],
		        ['Arkansas', 'AR'],
		        ['California', 'CA'],
		        ['Colorado', 'CO'],
		        ['Connecticut', 'CT'],
		        ['Delaware', 'DE'],
		        ['Florida', 'FL'],
		        ['Georgia', 'GA'],
		        ['Hawaii', 'HI'],
		        ['Idaho', 'ID'],
		        ['Illinois', 'IL'],
		        ['Indiana', 'IN'],
		        ['Iowa', 'IA'],
		        ['Kansas', 'KS'],
		        ['Kentucky', 'KY'],
		        ['Kentucky', 'KY'],
		        ['Louisiana', 'LA'],
		        ['Maine', 'ME'],
		        ['Maryland', 'MD'],
		        ['Massachusetts', 'MA'],
		        ['Michigan', 'MI'],
		        ['Minnesota', 'MN'],
		        ['Mississippi', 'MS'],
		        ['Missouri', 'MO'],
		        ['Montana', 'MT'],
		        ['Nebraska', 'NE'],
		        ['Nevada', 'NV'],
		        ['New Hampshire', 'NH'],
		        ['New Jersey', 'NJ'],
		        ['New Mexico', 'NM'],
		        ['New York', 'NY'],
		        ['North Carolina', 'NC'],
		        ['North Dakota', 'ND'],
		        ['Ohio', 'OH'],
		        ['Oklahoma', 'OK'],
		        ['Oregon', 'OR'],
		        ['Pennsylvania', 'PA'],
		        ['Rhode Island', 'RI'],
		        ['South Carolina', 'SC'],
		        ['South Dakota', 'SD'],
		        ['Tennessee', 'TN'],
		        ['Texas', 'TX'],
		        ['Utah', 'UT'],
		        ['Vermont', 'VT'],
		        ['Virginia', 'VA'],
		        ['Washington', 'WA'],
		        ['West Virginia', 'WV'],
		        ['Wisconsin', 'WI'],
		        ['Wyoming', 'WY'],
		    ];

		    if (to == 'abbr'){
		        input = input.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
		        for(i = 0; i < states.length; i++){
		            if(states[i][0] == input){
		                return(states[i][1]);
		            }
		        }    
		    } else if (to == 'name'){
		        input = input.toUpperCase();
		        for(i = 0; i < states.length; i++){
		            if(states[i][1] == input){
		                return(states[i][0]);
		            }
		        }    
		    }
		}

		/**
		* Initialize the map.
		*/
		init() {
	        this.drawingManager = new google.maps.drawing.DrawingManager({
	            drawingMode: google.maps.drawing.OverlayType.POLYGON,
	            polygonOptions: {
		            fillOpacity: 0.9,
		            editable: true,
		            draggable: true,
		            strokeWeight: 2,
		            strokeColor: '#06fe00',
		        },
	            drawingControlOptions: {
		            drawingModes: ['polygon']
				},
	            map: new google.maps.Map(document.getElementById('map'), {
		            zoom: 5,
		            center: new google.maps.LatLng(39.5008311,-97.4639777),
		            mapTypeId: google.maps.MapTypeId.ROADMAP,
		            disableDefaultUI: true,
		            zoomControl: true
		        })
	        });
	        this.drawingManager.setDrawingMode(null);

	        this.marker = new google.maps.Marker({
			    position: new google.maps.LatLng(0, 0),
			    title: ""
			});
			this.marker.setMap(null);

	        // Other elements
	        this.buildColorPalette();
	        this.buildSidePanel();

	        // Event listeners
	        google.maps.event.addListener(this.drawingManager, 'overlaycomplete', this.shapeDrawn.bind(this));
	        google.maps.event.addListener(this.drawingManager, 'drawingmode_changed', this.clearSelection.bind(this));
	        google.maps.event.addListener(this.drawingManager.map, 'click', this.clearSelection.bind(this));
	        google.maps.event.addDomListener(document.getElementById('save-button'), 'click', this.save.bind(this));
	        google.maps.event.addDomListener(document.getElementById('delete-button'), 'click', this.deleteSelected.bind(this));
	        google.maps.event.addDomListener(document.getElementById('duplicate-button'), 'click', this.duplicateSelected.bind(this));

	        // Load map data
	        this.loadMapData();
		}
	};

	// Initialize the map object
    google.maps.event.addDomListener(window, 'load', function() {
    	let map = new Map();

    	map.init();

    	window.map = map;
    });

    $(document).ready(function() {
    	$('.dropdown-menu .dropdown-item').on('click', function() {
    		let state = $(this).html();

    		window.map.loadTemplateShape(state);
    	});

    	$('.open-search-box').on('click', function(){
    		if ($(this).hasClass('active')) {
				$('.search-menu').hide();
    			$(this).removeClass('active');
    		}
    		else {
    			$('.search-menu').fadeIn();
    			$(this).addClass('active');
    		}
		});

		$('#search-button').on('click', function(e) {
			e.preventDefault();

			var location = $('#location').val();

			resetResponse();
			searchOpenStreetMapLocation(location);
		});

		$('#response').on('click', '.clear-results', function() {
			resetResponse();
		});
    });

    function resetResponse() {
		$('#response').text('').removeClass('alert alert-danger alert-warning alert-success alert-primary');
		$('#results').html('');
	}

	function searchOpenStreetMapLocation(location) {
		$.get('https://nominatim.openstreetmap.org/search.php?q='+location+'&polygon_geojson=1&viewbox=&format=json', function(response) {
			if (response === undefined || response.length < 1)
				$('#response').text("No results found.").addClass("alert alert-warning");

			$('#response').text("Found "+response.length+" results: ").addClass("alert alert-success").append("<a class='clear-results'><i class='fa fa-close'></i> Clear Search Results</a>");
			for (var i = 0; i < response.length; i++)
			{
				var result = response[i];
				$entry = $('#results').append('<div><strong>'+result.display_name+'</strong> ('+result.lat+', '+result.lon+') <a id="entry'+i+'">Use This Shape</a></div>');
				$('#entry'+i).data(result);
				$('#entry'+i).on('click', function() {
					var d = $(this).data();
					window.map.loadCustomShape(d.geojson);
					$('.search-menu').hide();
					$('.open-search-box').removeClass('active');
				});
			}
		}).fail(function() {
			$('#response').text("Could not connect to nominatim.openstreetmap.org.").addClass("alert alert-danger");
		});
	}
})(jQuery);