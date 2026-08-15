<!-- [MS-PPTX] v25.0 §2.3.1.5 defaultImageDpi -->

#### defaultImageDpi


*Target namespace: *http://schemas.microsoft.com/office/powerpoint/2010/main

<a id="CC_8d61ed5f000000000000000000000000"></a>A __CT_DefaultImageDpi__ element (section [2.3.3.3](#Section_5099194613ca4ee48efb20d8f4770a17)) that specifies the resolution, in dots per inch (dpi), to use when saving images in the document. This element value is used only when the __autoCompressPictures__ attribute ([[ISO/IEC29500-1:2016]](https://go.microsoft.com/fwlink/?linkid=861065) section 19.2.1.26) is set to __true__, and the __useLocalDpi__ element ([[MS-ODRAWXML]](%5bMS-ODRAWXML%5d.pdf#Section_06cff208c6e14db7bb68665135e5f0de) section 2.3.1.13) is set to __false__. See section [2.2.7](#Section_3c206095ec1d44a8a21d77796c03d59e) for how this element integrates with [ISO/IEC29500-1:2016].

The following W3C XML Schema ([[XMLSCHEMA1/2]](https://go.microsoft.com/fwlink/?LinkId=90607) section 2.1) fragment specifies the contents of this element.

1. <xsd:element name="defaultImageDpi" type="CT_DefaultImageDpi"/>

See section [5.1](#Section_cc91572885a446a0a07ceb5416a5762e) for the full W3C XML Schema ([XMLSCHEMA1/2] section 2.1).
