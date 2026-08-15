<!-- sourced from [MS-OWEXML] v11.0 / 2024-08-20 -->
<!-- heading: CT_OsfTaskpane -->

### CT_OsfTaskpane


*Target namespace: *http://schemas.microsoft.com/office/webextensions/taskpanes/2010/11

*Referenced by: *[CT_OsfTaskpanes](#Section_3bc6c9f4154840dfaf01e9c801a0a237)

<a id="CC_62814ff2000000000000000000000000"></a>A complex type that specifies a persisted taskpane object.

*Child Elements:*

<a id="CC_ea84a12e000000000000000000000000"></a>__webextensionref: __A __CT_WebExtensionPartRef__ element (section [2.2.10](#Section_d1cf44a9fd234a3f91dae0c9589e604e)) that specifies the container for a part relationship identifier that references the web extension part associated with the taskpane instance.__ __

<a id="CC_fe8ff2c9000000000000000000000000"></a>__extLst: __A __CT_OfficeArtExtensionList__ element ([[ISO/IEC29500-1:2016]](https://go.microsoft.com/fwlink/?linkid=861065) section A.4.1) that specifies a list of extensions for an [__Office Add-in__](#gt_8212530d-483d-4917-88bf-ab412b3dc178). This element MAY be ignored.

*Attributes:*

<a id="CC_6ab55565000000000000000000000000"></a>__dockstate: __A string attribute ([[XMLSCHEMA2/2]](https://go.microsoft.com/fwlink/?LinkId=90609) section 3.2.1) that specifies the last-docked location of this taskpane object__.__

<a id="CC_8daa3233000000000000000000000000"></a>__visibility: __A Boolean attribute ([XMLSCHEMA2/2] section 3.2.2) that specifies whether the [__Task Pane__](#gt_6612e30f-4bf7-45e0-a99c-d15eeb1a1f0c) shows as visible by default when the document opens.

<a id="CC_e6bc2aab000000000000000000000000"></a>__width: __A double attribute ([XMLSCHEMA2/2] section 3.2.5) that specifies the default width value for this taskpane instance__.__

<a id="CC_4bd2c25a000000000000000000000000"></a>__row: __An unsignedInt attribute ([XMLSCHEMA2/2] section 3.3.22) that specifies the index, enumerating from the outside to the inside, of this taskpane among other persisted taskpanes docked in the same default location__.__

<a id="CC_dd90509f000000000000000000000000"></a>__locked: __A Boolean attribute ([XMLSCHEMA2/2] section 3.2.2) that specifies whether the taskpane is locked to the document in the UI and cannot be closed by the user.

The following W3C XML Schema ([[XMLSCHEMA1/2]](https://go.microsoft.com/fwlink/?LinkId=90607) section 2.1) fragment specifies the contents of this complex type.

1. <xsd:complexType name="CT_OsfTaskpane">
2.   <xsd:sequence>
3.     <xsd:element name="webextensionref" minOccurs="1" maxOccurs="1" type="we:CT_WebExtensionPartRef"/>
4.     <xsd:element name="extLst" type="a:CT_OfficeArtExtensionList" minOccurs="0" maxOccurs="1"/>
5.   </xsd:sequence>
6.   <xsd:attribute name="dockstate" type="xsd:string" use="required"/>
7.   <xsd:attribute name="visibility" type="xsd:boolean" use="required"/>
8.   <xsd:attribute name="width" type="xsd:double" use="required"/>
9.   <xsd:attribute name="row" type="xsd:unsignedInt" use="required"/>
10.   <xsd:attribute name="locked" type="xsd:boolean" use="optional" default="false"/>
11. </xsd:complexType>

See section [5.2](#Section_084678b6e1804609966b175e7a9eb31e) for the full W3C XML Schema ([XMLSCHEMA1/2] section 2.1).
