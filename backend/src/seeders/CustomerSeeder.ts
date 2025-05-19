import { Customer } from "../models/Customer";

export const seedCustomers = async () => {
    const data = [
        {
            fullname: "Nguyễn Văn An",
            phonenumber: "0901234567",
            address: "123 Nguyễn Trãi, Quận 1, TP.HCM",
            loyaltyPoint: 0,
        },
        {
            fullname: "Trần Thị Bình",
            phonenumber: "0912345678",
            address: "456 Lê Lợi, Quận 3, TP.HCM",
            loyaltyPoint: 0,
        },
        {
            fullname: "Lê Minh Cường",
            phonenumber: "0923456789",
            address: "789 Điện Biên Phủ, Quận Bình Thạnh, TP.HCM",
            loyaltyPoint: 0,
        },
        {
            fullname: "Phạm Thị Dung",
            phonenumber: "0934567890",
            address: "101 Cách Mạng Tháng 8, Quận 10, TP.HCM",
            loyaltyPoint: 0,
        },
        {
            fullname: "Võ Hoàng Em",
            phonenumber: "0945678901",
            address: "202 Võ Văn Tần, Quận 3, TP.HCM",
            loyaltyPoint: 0,
        },
        {
            fullname: "Hoàng Văn Phúc",
            phonenumber: "0956789012",
            address: "303 Nguyễn Đình Chiểu, Quận 3, TP.HCM",
            loyaltyPoint: 0,
        },
        {
            fullname: "Đặng Thị Giang",
            phonenumber: "0967890123",
            address: "404 Nguyễn Thị Minh Khai, Quận 1, TP.HCM",
            loyaltyPoint: 0,
        },
        {
            fullname: "Bùi Thanh Hải",
            phonenumber: "0978901234",
            address: "505 Hai Bà Trưng, Quận 1, TP.HCM",
            loyaltyPoint: 0,
        },
        {
            fullname: "Trương Văn Ích",
            phonenumber: "0989012345",
            address: "606 Nguyễn Huệ, Quận 1, TP.HCM",
            loyaltyPoint: 0,
        },
        {
            fullname: "Dương Thị Kim",
            phonenumber: "0990123456",
            address: "707 Lý Tự Trọng, Quận 1, TP.HCM",
            loyaltyPoint: 0,
        },
    ];

    for (const item of data) {
        await Customer.findOrCreate({
            where: { phonenumber: item.phonenumber }, // Kiểm tra dựa trên số điện thoại
            defaults: item,
        });
    }
};
