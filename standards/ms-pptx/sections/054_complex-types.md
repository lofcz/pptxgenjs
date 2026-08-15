<!-- sourced from [MS-PPTX] v25.0 / 2024-08-20 -->
<!-- heading: Complex Types -->

### Complex Types


#### <a id="section_208645d6756f4479a3d2249ebd379d28"></a><a id="_Toc174685967"></a>CT_DesignElement

*Target namespace: *http://schemas.microsoft.com/office/powerpoint/2015/main

*Referenced by: *[designElem](#Section_465ea8114e454288a783bef4b9ec6eec)

<a id="CC_5bba5b15000000000000000000000000"></a>A complex type that specifies design element extensions to the __CT_ApplicationNonVisualDrawingProps__ complex type ([[ISO/IEC29500-4:2016]](https://go.microsoft.com/fwlink/?linkid=861068) section A.4)<a id="Appendix_A_Target_32"></a>[<32>](#Appendix_A_32" \o "Product behavior note 32) 

*Attributes:*

<a id="CC_00c376be000000000000000000000000"></a>__val: __An xsd:boolean ([[XMLSCHEMA2/2]](https://go.microsoft.com/fwlink/?LinkId=90609) section 3.2.2) attribute that specifies whether an element is a design element.

The following W3C XML Schema ([[XMLSCHEMA1/2]](https://go.microsoft.com/fwlink/?LinkId=90607) section 2.1) fragment specifies the contents of this complex type.

1. <xsd:complexType name="CT_DesignElement">
2.   <xsd:attribute name="val" type="xsd:boolean"/>
3. </xsd:complexType>

See section [5.6](#Section_166486237c2a4c18a7cb093daa05500e) for the full W3C XML Schema ([XMLSCHEMA1/2] section 2.1).
