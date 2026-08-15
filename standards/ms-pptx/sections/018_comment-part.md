<!-- sourced from [MS-PPTX] v25.0 / 2024-08-20 -->
<!-- heading: Comment Part -->

### Comment Part


*Referenced by: *[*commentRel*](#Section_c0f70c68e456452bb6fe6ff6bc36bd90)

The following table specifies a new Comment part that can be stored in a PresentationML document.

Part Components

Value

Content type

application/vnd.ms-powerpoint.comments+xml

Root namespace

http://schemas.microsoft.com/office/powerpoint/2018/8/main

Source relationship

http://schemas.microsoft.com/office/2018/10/relationships/comments

An instance of a Comment part specifies a set of comments included by a PresentationML document.

A Comment part MUST be the target of an explicit relationship from the Slide part ([[ISO/IEC29500-1:2016]](https://go.microsoft.com/fwlink/?linkid=861065) section 13.3.8).

The root element for a part of this content type MUST be __cmLst __(section [2.16.1.2](#Section_653f8a0b01d4446394d42c4fc2fe6bb2)).

A Comment part MUST be located within the package containing the relationships part (expressed syntactically, the __TargetMode__ attribute of the __Relationship__ element ([[ISO/IEC29500-2:2012]](https://go.microsoft.com/fwlink/?LinkID=330448) section 6.5.3.4) MUST be Internal.
