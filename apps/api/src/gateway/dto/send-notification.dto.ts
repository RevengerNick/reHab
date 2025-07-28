import { Type } from 'class-transformer';
import { IsArray, IsDefined, IsEnum, IsNotEmpty, IsObject, IsOptional, IsString, ValidateNested } from 'class-validator';

// Описываем одного получателя
class RecipientDto {
  @IsEnum(['EMAIL', 'SMS', 'TELEGRAM']) // Принимаем только эти каналы
  channel: 'EMAIL' | 'SMS' | 'TELEGRAM';

  @IsString()
  @IsNotEmpty()
  to: string; // Адрес/телефон/id

  @IsObject()
  @IsOptional()
  variables?: Record<string, any>; // Переменные для шаблона
}

// Описываем все тело запроса
export class SendNotificationDto {
  @IsArray()
  @ValidateNested({ each: true }) // Валидировать каждый объект в массиве
  @Type(() => RecipientDto) // Указываем тип для вложенной валидации
  recipients: RecipientDto[];

  @IsString()
  @IsOptional()
  templateId?: string;
}