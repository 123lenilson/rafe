import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Em ES Modules, precisamos recriar o __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 1. A tua lista exata de classes
const listaDeClasses = [
  "_draftsTableContainer_1o7vl_1", "_tableWrapper_1acga_4", "_table_1acga_4",
  "_tableCaption_1acga_17", "_tableHead_1rlph_1", "_tableHeadRow_1rlph_21",
  "_tableHead_hi0p4_3", "_tableBody_1cp5b_1", "_tableRow_1oq8u_3",
  "_tableData_1u4jr_5", "_linkIdentifier_1acga_18", "_collapsibleColumn_1acga_26",
  "_alignmentCenter_hi0p4_15", "_alignmentStart_hi0p4_11", "_alignmentCenter_1u4jr_17",
  "_alignmentStart_1u4jr_12", "_checkboxCell_hi0p4_31", "_checkboxCell_1u4jr_75",
  "_dueDateCell_fuxy9_5", "_statusCell_fuxy9_9", "_recipientCell_fuxy9_13",
  "_amountCell_fuxy9_82", "_invoiceNumberCell_fuxy9_88", "_lastUpdatedOnCell_fuxy9_99",
  "_sortableHeaderCell_fuxy9_114", "_interactiveRows_1oq8u_35", "_selectedRow_1oq8u_64",
  "_large_1oq8u_29", "_showHoverActions_1o7vl_18", "_rowHoverActions_affr2_1",
  "_checkboxHeightFix_1wfxj_6", "_checkboxWrapper_1o8bl_62", "_defaultCheckboxWrapper_1452f_14",
  "_inTable_1o8bl_108", "_input_1o8bl_13", "_defaultInput_1452f_44",
  "_checkbox_1o8bl_12", "_defaultCheckbox_1452f_14", "_button_83txq_20",
  "_small_83txq_76", "_destructive_83txq_190", "_primary_83txq_108",
  "_icon_83txq_112", "_iconOnly_83txq_287", "_iconSmall_83txq_277",
  "_center_83txq_272", "_right_83txq_87", "_visuallyHiddenLabel_83txq_12",
  "_sortIcon_fuxy9_131", "_hoverChevron_fuxy9_123", "_ascSortIcon_fuxy9_136",
  "_editIcon_u67me_63", "_editIcon_1isei_30", "_badge_j3db1_4",
  "_warning_j3db1_82", "_badgeBackground_j3db1_19", "_small_299z2_48",
  "_circle_299z2_4", "_noHover_299z2_93", "_iconAvatar_299z2_102",
  "_uploadIcon_fuxy9_58", "_startsWithJ_299z2_180", "_textAvatar_299z2_78",
  "_tinyAvatar_u67me_96", "_transitionWrapper_177yu_5", "_draftCardWrapper_nfv0v_7",
  "_large_1jk2m_9", "_noHover_41fwg_28", "_shadow_41fwg_25",
  "_raisedBackground_41fwg_45", "_panel_177yu_55", "_panelHeader_177yu_65",
  "_headerContentWrapper_177yu_87", "_headerActionsWrapper_177yu_93", "_additionalActionsWrapper_177yu_94",
  "_closeButtonWrapper_177yu_117", "_additionalActionsButton_177yu_99", "_panelBody_177yu_64",
  "_panelSection_177yu_153", "_metaSection_nfv0v_1", "_container_u67me_4",
  "_stack_u67me_12", "_gap8_u67me_18", "_gap4_u67me_22",
  "_amountAndEditIconWrapper_u67me_39", "_unstyledButtonWithoutFocus_u67me_79", "_usdAmountContainer_u67me_50",
  "_lastEdited_u67me_90", "_actionButtons_u67me_26", "_container_1isei_4",
  "_detailRow_1isei_10", "_unstyledButtonWithoutFocus_1isei_102", "_labelText_1isei_22",
  "_canEdit_1isei_34", "_valueIconContainer_1isei_30", "_valueContainer_1isei_34",
  "_valueText_1isei_93", "_bodyDefault_qaod7_40", "_bodySecondary_qaod7_51",
  "_tiny_qaod7_67", "_titleMain_qaod7_16", "_label_qaod7_59",
  "_text-secondary_12t49_1", "_text-default_12t49_1", "_text-emphasized_12t49_1",
  "_text-tertiary_12t49_1", "_text-link_12t49_1", "_recipientName_fuxy9_62",
  "_iconContainer_fuxy9_16", "_padRight_1rihk_3", "_dollarDisplay_1of3b_3",
  "_superscript_1of3b_35", "_fractionalDelimiter_1of3b_43", "_integerDelimiter_1of3b_27",
  "_textCell_1u4jr_112", "_label_1u4jr_118", "_subLabel_1u4jr_125",
  "_offsetUpwards_299z2_71", "_lastLetter_299z2_64", "_tooltipAnchor_1to1k_4",
  "_container_1th35_1", "_label_1nilg_3", "_textareaBoundingWrapper_37f6o_7",
  "_label_37f6o_62", "_visuallyHidden_37f6o_214", "_textareaProgressWrapper_37f6o_27",
  "_textareaWrapper_37f6o_16", "_rowSizing_37f6o_136", "_textarea_37f6o_7",
  "_emailSectionContainer_1t7l9_3", "_topSection_1t7l9_10", "_truncate_1t7l9_17",
  "_attachmentsContainer_tphkj_1", "_outerWrapper_1jbb1_27", "_attachmentsList_1jbb1_514",
  "_singleAttachmentContainer_1jbb1_279", "_fileUploadAttachment_1jbb1_282", "_only_1jbb1_308",
  "_singleAttachment_1jbb1_279", "_attachmentLeftSlot_1jbb1_205", "_fileIcon_1jbb1_219",
  "_container_1acnw_3", "_fileName_1jbb1_380", "_visuallyHidden_1acnw_8",
  "_textHead_1acnw_12", "_textTail_1acnw_22", "_attachmentRightSlot_1jbb1_229",
  "_includeMinWidth_1jbb1_238", "_downloadIcon_1jbb1_267", "_dropzoneCompact_1jbb1_105",
  "_hasFiles_1jbb1_91", "_uploadButton_1jbb1_119", "_uploadIcon_1jbb1_56"
];

// 2. Leitura dos ficheiros da pasta atual
const resultados = [];

fs.readdirSync(__dirname).forEach(file => {
  if (file.endsWith('.css')) {
    const caminhoFicheiro = path.join(__dirname, file);
    const conteudo = fs.readFileSync(caminhoFicheiro, 'utf8');

    listaDeClasses.forEach(classe => {
      if (conteudo.includes(classe)) {
        resultados.push({
          Classe: classe,
          FicheiroCSS: file
        });
      }
    });
  }
});

console.table(resultados);