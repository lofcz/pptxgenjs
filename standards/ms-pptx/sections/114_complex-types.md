<!-- sourced from [MS-PPTX] v25.0 / 2024-08-20 -->
<!-- heading: Complex Types -->

### Complex Types


#### <a id="section_979b46d1d6474750a8473d59e27675d3"></a><a id="_Toc174686119"></a>CT_DesignerDrawingProps

*Target namespace: *http://schemas.microsoft.com/office/powerpoint/2020/02/main

*Referenced by: *[designPr](#Section_4f40bd5c5ad24657b4f0d67a082cb634)

<a id="CC_1667298b000000000000000000000000"></a>A complex type that specifies designer property extensions to the __CT_ApplicationNonVisualDrawingProps__ complex type ([[ISO/IEC29500-4:2016]](https://go.microsoft.com/fwlink/?linkid=861068) section A.4) <a id="Appendix_A_Target_34"></a>[<34>](#Appendix_A_34" \o "Product behavior note 34)

*Child Elements:*

<a id="CC_86e6b267000000000000000000000000"></a>__p202:designTagLst: __A [CT_DesignerTagList](#Section_5aef0144b2444072851bfac98708024e) element that specifies [__Designer Service__](#gt_073bc2d5-0b75-4667-b0e0-4feea69c2bfb) generated metadata regarding changes made to a shape. 

<a id="CC_cb0ef67b000000000000000000000000"></a>__extLst: __A p:CT_ExtensionList ([[ISO/IEC-29500-4]](https://go.microsoft.com/fwlink/?LinkId=150884) section A.3) element that specifies the extension list. All future extensions to the designer properties will be stored in the extension list.

*Attributes:*

<a id="CC_b7e6b0de000000000000000000000000"></a>__edtDesignElem: __A xsd:boolean ([[XMLSCHEMA2/2]](https://go.microsoft.com/fwlink/?LinkId=90609) section 3.2.2) attribute that specifies whether a design element is editable.

The following W3C XML Schema ([[XMLSCHEMA1/2]](https://go.microsoft.com/fwlink/?LinkId=90607) section 2.1) fragment specifies the contents of this complex type.

1. <xsd:complexType name="CT_DesignerDrawingProps">
2.   <xsd:sequence>
3.     <xsd:element ref="p202:designTagLst" minOccurs="0" maxOccurs="1"/>
4.     <xsd:element name="extLst" type="p:CT_ExtensionList" minOccurs="0" maxOccurs="1"/>
5.   </xsd:sequence>
6.   <xsd:attribute name="edtDesignElem" type="xsd:boolean" use="optional" default="false"/>
7. </xsd:complexType>

See section [5.16](#Section_e68b6b1996544d2b929a0860e37ce25d) for the full W3C XML Schema ([XMLSCHEMA1/2] section 2.1).

#### <a id="section_9978ca232ce946fba58878b960aacead"></a><a id="_Toc174686120"></a>CT_DesignerTag

*Target namespace: *http://schemas.microsoft.com/office/powerpoint/2020/02/main

*Referenced by: *[CT_DesignerTagList](#Section_5aef0144b2444072851bfac98708024e)

<a id="CC_8765bcae000000000000000000000000"></a>A complex type that specifies a [__Designer Service__](#gt_073bc2d5-0b75-4667-b0e0-4feea69c2bfb) defined metadata item in the form of a name/value pair. <a id="Appendix_A_Target_35"></a>[<35>](#Appendix_A_35" \o "Product behavior note 35)

*Attributes:*

<a id="CC_67fb8841000000000000000000000000"></a>__name: __A xsd:string ([[XMLSCHEMA2/2]](https://go.microsoft.com/fwlink/?LinkId=90609) section 3.2.1) attribute that specifies the name of the metadata item.

<a id="CC_88676b99000000000000000000000000"></a>__val: __A xsd:string ([XMLSCHEMA2/2] section 3.2.1) attribute that specifies the value of the metadata item.

The following W3C XML Schema ([[XMLSCHEMA1/2]](https://go.microsoft.com/fwlink/?LinkId=90607) section 2.1) fragment specifies the contents of this complex type.

1. <xsd:complexType name="CT_DesignerTag">
2.   <xsd:attribute name="name" type="xsd:string" use="required"/>
3.   <xsd:attribute name="val" type="xsd:string" use="required"/>
4. </xsd:complexType>

See section [5.16](#Section_e68b6b1996544d2b929a0860e37ce25d) for the full W3C XML Schema ([XMLSCHEMA1/2] section 2.1).

#### <a id="section_5aef0144b2444072851bfac98708024e"></a><a id="_Toc174686121"></a>CT_DesignerTagList

*Target namespace: *http://schemas.microsoft.com/office/powerpoint/2020/02/main

*Referenced by: *[CT_DesignerDrawingProps](#Section_979b46d1d6474750a8473d59e27675d3), [designTagLst](#Section_d3778e8e03b74f73b772fa515688159a)

<a id="CC_1d8eddaa000000000000000000000000"></a>A complex type that specifies [__Designer Service__](#gt_073bc2d5-0b75-4667-b0e0-4feea69c2bfb) defined metadata regarding changes made to a slide or shape made by the Designer Service. <a id="Appendix_A_Target_36"></a>[<36>](#Appendix_A_36" \o "Product behavior note 36)

*Child Elements:*

<a id="CC_8339b9a6000000000000000000000000"></a>__designTag: __A [CT_DesignerTag](#Section_9978ca232ce946fba58878b960aacead) element that specifies a metadata item consisting of a name/value pair.

The following W3C XML Schema ([[XMLSCHEMA1/2]](https://go.microsoft.com/fwlink/?LinkId=90607) section 2.1) fragment specifies the contents of this complex type.

1. <xsd:complexType name="CT_DesignerTagList">
2.   <xsd:sequence>
3.     <xsd:element name="designTag" type="CT_DesignerTag" minOccurs="0" maxOccurs="unbounded"/>
4.   </xsd:sequence>
5. </xsd:complexType>

See section [5.16](#Section_e68b6b1996544d2b929a0860e37ce25d) for the full W3C XML Schema ([XMLSCHEMA1/2] section 2.1).
